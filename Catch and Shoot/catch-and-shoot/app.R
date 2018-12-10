#
# This is a Shiny web application. You can run the application by clicking
# the 'Run App' button above.
#
# Find out more about building applications with Shiny here:
#
#    http://shiny.rstudio.com/
#

library(shiny)
library(r2d3)
library(tidyverse)
library(stringr)
efg <- read.csv('cs-over-50-fga.csv')
namesdf <- efg %>% separate(PLAYER, c("First", "Last", "Suffix"), remove = FALSE, sep = " ") %>% arrange(Last)
teamsdf <- efg %>%  arrange(TEAM)

efg$isSelected <- TRUE
pbpshort <- read.csv('all-log-short.csv')



ui <- fluidPage(
  tags$head(
    tags$link(rel = "stylesheet", type = "text/css", href = "styles.css"),
    
    # tags$script(src="d3moji.js"),
    tags$script(src="//twemoji.maxcdn.com/2/twemoji.min.js?11.2")
    # tags$script(src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js")
    # tags$link(href="https://fonts.googleapis.com/css?family=Gothic+A1", rel="stylesheet")
  ),
  
  mainPanel(
    titlePanel("Shooter McCatchins NBA"),
     tags$h4("Analysis of the best catch and shoot masters in the NBA", style="font-family:  Arial ; font-size; 16px;"),
    
    tabsetPanel(type = "tabs",id = "inTabset",
                tabPanel("Overview",
                         tags$div(class = "plotContainer",
                                  selectInput("selectTeams", "Limit to specific teams:",unique(teamsdf$TEAM), multiple = TRUE),
                                  d3Output("mainPlot"),
                                  tableOutput('mainTable')
                         ) 
                ),
                tabPanel("Bohr Shot Diagram", 
                         value="Player",
                         selectInput("selectPlayer", "Select your player:",unique(namesdf$PLAYER)),
                         selectInput("selectPeriod", "Periods:",unique(pbpshort$PERIOD), multiple = TRUE),
                         d3Output("playerPlot"),
                         d3Output("playerShotPlot"),
                         tableOutput('playerTable')
                ),
                tabPanel("Shot Chart", 
                         value="shotchart",
                         selectInput("selectPlayerShot", "Select your player:",unique(namesdf$PLAYER)),
                         selectInput("selectPeriodShot", "Periods:",unique(pbpshort$PERIOD), multiple = TRUE),
                         d3Output("shotChart"),
                         tableOutput('shotChartTable')
                )
    ),
    tags$div(class = "footer",
             tags$div(class = "footerItem",
                      tags$p("Made by ",
                             tags$a(href="https://twitter.com/scottyla1", "@scottyla1"))
             ),
             tags$div(class = "footerItem",
                      tags$p("Data provided by ",
                             tags$a(href="https://www.stats.nba.com", "NBA Stats")
                            
                      )
             )
    )
  )
)

server <- function(input, output, session) {
  observeEvent(input$Player, {
    updateSelectInput(session, "selectPlayer",
                      selected = input$Player
    )
    updateTabsetPanel(session, "inTabset",
                      selected = "Player"
    )
  })
  
  
  output$mainPlot <- renderD3({

    filterdata <- efg
    if (!isTruthy(input$selectTeams)) {
      filterdata <- efg
    } else{
      filterdata <-  efg %>% mutate(isSelected = ifelse(TEAM %in% input$selectTeams, isSelected, FALSE)) # filter(TEAM %in% input$selectTeams)
    }
    r2d3(
      data = filterdata ,
      script = "main-plot.js")
    
  })
  
  output$playerPlot <- renderD3({
    filteredata <- pbpshort %>% filter(PLAYER_NAME %in% input$selectPlayer & !is.na(SHOT_DISTANCE))
    if (!isTruthy(input$selectPeriod)) {
      filteredata <- filteredata
    } else{
      filteredata <-  filteredata %>% filter(PERIOD %in% input$selectPeriod)
    }
    r2d3(
      data = filteredata,
      script = "bohr-shot-diagram.js")
    
  })
  
  output$shotChart <- renderD3({
    filteredata <- pbpshort %>% filter(PLAYER_NAME %in% input$selectPlayer & !is.na(SHOT_DISTANCE))
    if (!isTruthy(input$selectPeriod)) {
      filteredata <- filteredata
    } else{
      filteredata <-  filteredata %>% filter(PERIOD %in% input$selectPeriod)
    }
    r2d3(
      data = filteredata,
      script = "shot-chart.js")
    
  })
  
  output$playerTable <- renderTable(efg %>% filter(PLAYER==input$selectPlayer))
  
  # output$planetTable <- renderTable(planetDF %>% filter(name==input$selectPlanet) %>% select(-c("terrain2","url","color")))
  # 
  # output$peopleTable <- renderTable(peopleDF %>% filter(person==input$selectPerson) %>% select(c("person","height","mass","hair_color","skin_color","birth_year"
  #                                                                                                ,"eye_color","gender","planet","species_name")))
  # 
  # 
  # output$People <- renderText({
  #   input$People
  # })
  # 
  # output$Planet <- renderText({
  #   input$Planet
  # })
}


# Run the application 
shinyApp(ui = ui, server = server)
