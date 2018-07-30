import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
import plotly.graph_objs as go

app = dash.Dash(__name__, static_folder='static')
server = app.server
app.title = "Spida Web App Projections"
app.css.config.serve_locally = True
app.scripts.config.serve_locally = True

df = pd.read_csv('All-NBA-per-adv-stats.csv')
df.drop(columns='Unnamed: 0', inplace=True)
allRook1 = df[df.YrsInLg == 1].dropna()

test = df[(df.YrsInLg ==1) & (df.Season == '2017-18')].dropna()


namesOptions = [{'label':n, 'value': n} for n in sorted(test.Player.unique())]

def comparePlayer(player):
    playerdf = allRook1[allRook1.Player == player]
    train = df[(df.YrsInLg == 1) & (df.Season != '2017-18')]
    train = train[train.Player != player]
    X = train.iloc[:,2:]
    y = playerdf.iloc[:,2:]

    weights = np.array([0, .6, .7,1,.2,.2,.2,.2,.2,.2,.2,.2,.2,
                    .2,.2,.2,.2,.2,.2, .8,.2,.2,.2,.2,.8,
                   .7,.5,0,.6,.8,.6,.8,.8,.8,.8,1,
                    .8,1,.8,.8,1,1,1,1,1,1,1,1,0])

    nbrs = NearestNeighbors(n_neighbors=10,metric='wminkowski', p=2,
                           metric_params={'w': weights})
    nbrs.fit(X)
    neighbs = nbrs.kneighbors(y, 10, return_distance=False)
    comparr = []
    for n in neighbs:
        comparr = (train.iloc[n,0].values)
    complist = list(comparr)
    comps = df[df.Player.isin(complist)]
    comps1 = comps[comps.YrsInLg == 1]
    comps2 = comps[comps.YrsInLg == 2]
    compsdiff = comps2.mean() - comps1.mean()


    compdf = pd.concat([y.T,comps1.mean(),comps2.mean() ,compsdiff, comps2.min(),comps2.max(),comps2.std()], axis=1)
    compdf.columns=['PlayerRookie','AvgRookieComp','AvgYr2Comp','DiffYr2-Y1','MinComp','MaxComp','StdYr2Comp']
    compdf['ExpYr2'] = compdf.PlayerRookie + compdf['DiffYr2-Y1']
    alpha = 2.015

    compdf['ExpMax'] = compdf.ExpYr2 + (alpha * compdf.StdYr2Comp/np.sqrt(5))
    compdf['ExpMin'] = compdf.ExpYr2 - (alpha * compdf.StdYr2Comp/np.sqrt(5))
    compdf[(compdf.ExpYr2 < 0) & ((compdf.index != 'VORP')&(compdf.index != 'BPM'))] = 0
    data = compdf[['PlayerRookie','ExpMin','ExpYr2','ExpMax']]
    tempdf = compdf[['PlayerRookie','ExpMin','ExpYr2','ExpMax']]

    tempdf[tempdf < 0] = 0
    tempdf.loc['BPM',:] = data.loc['BPM',:].values
    tempdf.loc['VORP',:] = data.loc['VORP',:].values

    return tempdf, complist


def spidaPlot( categories, title,player):
    cdf, clist = comparePlayer(player)
    alpha = 2.015

    data = cdf[['PlayerRookie','ExpMin','ExpYr2','ExpMax']]

    data.fillna(0, inplace=True)
    data.drop(index=['Player','Season'], axis=1, inplace=True)
    data.loc[['FG%', '2P%','3P%','eFG%','TS%','FT%', '3PAr', 'FTr']] = data.loc[['FG%', '2P%','3P%','eFG%','TS%','FT%', '3PAr',  'FTr']]*100


    offAvg = data.ExpYr2.loc[categories]
    offMin = data.ExpMin.loc[categories]
    offMax = data.ExpMax.loc[categories]
    offRook = data.PlayerRookie.loc[categories]
    N = len(categories)

    # We are going to plot the first line of the data frame.
    # But we need to repeat the first value to close the circular graph:
    values=offAvg.tolist()
    values += values[:1]
    minValues=offMin.tolist()
    minValues += minValues[:1]
    maxValues=offMax.tolist()
    maxValues += maxValues[:1]
    rookValues=offRook.tolist()
    rookValues += rookValues[:1]

    maxval = max(values + minValues + maxValues + rookValues)
    minval = min(values + minValues + maxValues + rookValues)
    step = 5
    if maxval > 50:
        step = 10
    elif maxval < 10:
        maxval = 10
        step = 2


    plotData = [go.Scatterpolar(
        name = "Projected 2018-19",
      r = offAvg,
      theta = categories,
      fill = 'toself'
    ),
    go.Scatterpolar(
        name="2017-18",
      r = offRook,
      theta = categories,
      opacity=0.5
      # fill = 'toself'
    ),
    go.Scatterpolar(
        name="Expected Min",
      r = offMin,
      theta = categories,
      opacity=0.5
      # fill = 'toself'
    ),
    go.Scatterpolar(
        name="Expected Max",
      r = offMax,
      theta = categories,
      opacity=0.5
      # fill = 'toself'
    )]

    layout = go.Layout(
      polar = dict(
        radialaxis = dict(
          visible = True,
          range = [minval, maxval]
        )
      ),
      showlegend = True,
      title=title,
      height=500
    )
    testData = cdf[['PlayerRookie','ExpMin','ExpYr2','ExpMax']]
    if testData.dropna().empty:
        # offRook = testData.PlayerRookie.loc[categories]
        plotData = [go.Scatterpolar(
          name="2017-18",
          r = offRook,
          theta = categories,
          opacity=0.5,
          marker = dict(
        color = ('rgb(255,127,14)'))
          # fill = 'toself'
        )]
        return plotData,layout
    return plotData, layout

def makeTable(player, columns):
    data, clist = comparePlayer(player)
    if data.dropna().empty:
        return 'Player projections not available for {}'.format(player)

    data.drop(['Player','Season'], axis=0, inplace=True)
    data = data.round(3)
    # data.reset_index(inplace=True)
    # data.rename(columns={'index':'stat'}, inplace=True)
    cols = ['ExpMin','ExpYr2','ExpMax']

    data[cols] = data[cols].applymap(lambda x: '{:,g}'.format(x))

    tbl = data.loc[columns,:]

    tbl.reset_index(inplace=True)

    dataframe = tbl[['index','ExpMin','ExpYr2','ExpMax']]
    dataframe.rename(columns={'index':'','ExpYr2':'Projected'}, inplace=True)
    # dataframe = tbl[columns]
    rows = []
    for i in range(len(dataframe)):
        row = []
        for col in dataframe.columns:
            value = dataframe.iloc[i][col]
            # update this depending on which
            # columns you want to show links for
            # and what you want those links to be
            if col == 'id':
                cell = html.Td(html.A(href=value, children=value))
            else:
                cell = html.Td(children=value)
            row.append(cell)
        rows.append(html.Tr(row))
    return html.Table(
        # Header
        [html.Tr([html.Th(col) for col in dataframe.columns])] +

        rows
    )


app.layout = html.Div([
    html.Meta(name='viewport', content='width=device-width, initial-scale=1.0'),
    html.Link(
        rel='stylesheet',
        href='/static/styles.css'
    ),
    html.Link(
        rel='stylesheet',
        href='https://fonts.googleapis.com/css?family=PT+Sans'
    ),
    html.Div([html.H1('Spida Web App Player Projections'),
            html.H4('A simple nearest neighbors classifier for NBA rookies.')],className='header'),
    html.Div([
        dcc.Dropdown(
            id='name-dropdown',
            options= namesOptions,
            value="Donovan Mitchell"

        ),

        html.Img(id='player-pic',src='/static/picholder.png'),
        # html.P('How it works:'),
        # html.Ol([html.Li('Select your favorite rookie from the list below.',className='steps-list-item'),
        #         html.Li('The app then uses the k-nearest neighbors (KNN) algorithm to select the 10 most statistically similar historical rookies',className='steps-list-item'),
        #         html.Li('Using the 10 comparable players we get the mean difference from year 1 to year 2 and add it to our current year stats.',className='steps-list-item'),
        #         html.Li('Get the 90% confidence interval to get the range of minimum and maximum expected outputs for next season.',className='steps-list-item')],className='stepsList'),
                ],
        id='player-select-div'),
    html.H3('Comparable Players:',style={'padding':'10px'}),
    html.Div(id='comps-div'),
    html.Div([html.Div(id='tbl-basic-offense',className='tbl-div'),
            dcc.Graph(id='graph-basic-offense',className='graph-div', style={'max-width':800})],
            id='basic-offense',className='tbl-graph-container'
    ),html.Div([html.Div(id='tbl-adv',className='tbl-div'),
            dcc.Graph(id='graph-adv',className='graph-div', style={'max-width':800})],
            id='adv',className='tbl-graph-container'
    ),
    html.Div([html.Div(id='tbl-misc',className='tbl-div'),
            dcc.Graph(id='graph-misc',className='graph-div', style={'max-width':800})],
            id='misc',className='tbl-graph-container'
    ),html.Div([html.Div(id='tbl-shoot-rates',className='tbl-div'),
            dcc.Graph(id='graph-shoot-rates',className='graph-div', style={'max-width':800})],
            id='shoot-rates',className='tbl-graph-container'
    ),
    html.Div([
        html.Div(['Created by ', html.A("Scott LaForest", href='https://github.com/scottyla19', target="_blank")]),
        html.Div(['Player images provide by  ',  html.A("NBA headshots API", href='https://nba-players.herokuapp.com/', target="_blank")]),
        html.Div(['All data is from ',  html.A("Basketball-Reference.com", href='https://www.basketball-reference.com/', target="_blank")])
    ],className='footer')
#
# dcc.Graph(id='graph-misc'),
# dcc.Graph(id='graph-shoot-rates'),
# dcc.Graph(id='graph-adv')
])


@app.callback(
    Output(component_id='comps-div', component_property='children'),
    [Input(component_id='name-dropdown', component_property='value')]
)
def updateComps(input_value):
    cdf, clist = comparePlayer(input_value)
    cells = []
    for i, v in enumerate(clist):
        cells.append(html.Div(children='{}. {}'.format(i+1,v), className='comp-cell'))
    html.Div(html.H3('Comparable Players:'))
    return html.Div(cells, className='comps-container')
    # row1 = []
    # row2 = []
    # rows = []
    # for i, v in enumerate(clist):
    #
    #
    #     cell = html.Td(children='{}. {}'.format(i+1,v))
    #     if i < 5:
    #         row1.append(cell)
    #     else:
    #         row2.append(cell)
    # rows.append(html.Tr(row1))
    # rows.append(html.Tr(row2))
    #
    # return html.Table(
    #     [html.Tr([html.Th(html.H3('Comparable Players'))] +
    #     rows
    # )
    # comps = [html.H3('Comparable Players: ') , html.H4(' {}'.format(', '.join(clist)))]
    # return comps

@app.callback(
    Output(component_id='graph-basic-offense', component_property='figure'),
    [Input(component_id='name-dropdown', component_property='value')]
)
def basicOffenseGraph(input_value):
    dat, layt = spidaPlot( ['2P','2PA','3P','3PA','FT','FTA','PTS', '2P'], 'Basic Offense Projections (per 36 minutes)',player=input_value)

    return {
        'data': dat,
        'layout': layt
    }
@app.callback(
    Output(component_id='graph-shoot-rates', component_property='figure'),
    [Input(component_id='name-dropdown', component_property='value')]
)
def shootingGraph(input_value):
    dat, layt = spidaPlot( ['FG%', '2P%','3P%','eFG%','TS%', '3PAr', 'FTr','FG%'], 'Shooting Projections',player=input_value)

    return {
        'data': dat,
        'layout': layt
    }
@app.callback(
    Output(component_id='graph-misc', component_property='figure'),
    [Input(component_id='name-dropdown', component_property='value')]
)
def miscGraph(input_value):
    dat, layt = spidaPlot(['TRB','AST','STL', 'TOV','PF','TRB'], 'Miscellaneous Projections (per 36 minutes)',player=input_value)

    return {
        'data': dat,
        'layout': layt
    }
@app.callback(
    Output(component_id='graph-adv', component_property='figure'),
    [Input(component_id='name-dropdown', component_property='value')]
)
def advGraph(input_value):
    dat, layt = spidaPlot( ['DRB%','TRB%','AST%', 'TOV%','USG%', 'VORP', 'BPM','DRB%'], 'Advanced Projections',player=input_value)

    return {
        'data': dat,
        'layout': layt
    }
@app.callback(
    Output(component_id='tbl-basic-offense', component_property='children'),
    [Input(component_id='name-dropdown', component_property='value')]
)
def showTable(input_value):
    return makeTable(input_value, ['2P','2PA','3P','3PA','FT','FTA','PTS'])

@app.callback(
    Output(component_id='tbl-misc', component_property='children'),
    [Input(component_id='name-dropdown', component_property='value')]
)
def showTable(input_value):
    return makeTable(input_value, ['TRB','AST','STL', 'TOV','PF'])

@app.callback(
    Output(component_id='tbl-shoot-rates', component_property='children'),
    [Input(component_id='name-dropdown', component_property='value')]
)
def showTable(input_value):
    return makeTable(input_value, ['FG%', '2P%','3P%','eFG%','TS%', '3PAr', 'FTr'])

@app.callback(
    Output(component_id='tbl-adv', component_property='children'),
    [Input(component_id='name-dropdown', component_property='value')]
)
def showTable(input_value):
    return makeTable(input_value, ['DRB%','TRB%','AST%', 'TOV%','USG%', 'VORP', 'BPM'])


@app.callback(
    dash.dependencies.Output('player-pic', 'src'),
    [dash.dependencies.Input('name-dropdown', 'value')])
def update_image_src(input_value):
    nameList = input_value.split(" ")
    if len(nameList) == 3:
        nameList[1] = nameList[1] + '_' + nameList[2]
    if input_value == 'Dennis Smith':
        nameList = input_value.split(" ")
        nameList[1] = nameList[1] + '_' + 'jr'

    return  'https://nba-players.herokuapp.com/players/{}/{}'.format(nameList[1], nameList[0])


if __name__ == '__main__':
    app.run_server()
