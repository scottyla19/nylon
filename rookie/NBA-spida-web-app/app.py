import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.neighbors import NearestNeighbors
import plotly.graph_objs as go

app = dash.Dash(__name__, static_folder='static')
server = app.server
app.title = "NBA Spida Web App Projections"
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


    nbrs = NearestNeighbors(n_neighbors=5)
    nbrs.fit(X)
    neighbs = nbrs.kneighbors(y, 5, return_distance=False)
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
    return compdf, complist

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
        name="Low Comps",
      r = offMin,
      theta = categories,
      opacity=0.5
      # fill = 'toself'
    ),
    go.Scatterpolar(
        name="High Comps",
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
    return plotData, layout

def makeTable(dataframe):
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
    dcc.Dropdown(
        id='name-dropdown',
        options= namesOptions,
        value="Donovan Mitchell"

    ),
    html.Div(id='my-div'),
    html.Img(id='player-pic'),
    dcc.Graph(id='graph-basic-offense'),
    dcc.Graph(id='graph-misc'),
    dcc.Graph(id='graph-shoot-rates'),
    dcc.Graph(id='graph-adv'),
    html.Div(id='tbl-div')
])


@app.callback(
    Output(component_id='my-div', component_property='children'),
    [Input(component_id='name-dropdown', component_property='value')]
)
def updateComps(input_value):
    cdf, clist = comparePlayer(input_value)
    return 'Comparable Players "{}"'.format(clist)

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
    Output(component_id='tbl-div', component_property='children'),
    [Input(component_id='name-dropdown', component_property='value')]
)
def showTable(input_value):
    data, clist = comparePlayer(input_value)
    if data.dropna().empty:
        return 'Player projections not available for {}'.format(input_value)

    data.drop(['Player','Season'], axis=0, inplace=True)
    data = data.round(3)
    data.reset_index(inplace=True)
    data.rename(columns={'index':'stat'}, inplace=True)
    cols = ['ExpMin','ExpYr2','ExpMax']

    data[cols] = data[cols].applymap(lambda x: '{:,g}'.format(x))
    return makeTable(data[['stat','ExpMin','ExpYr2','ExpMax']])
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
