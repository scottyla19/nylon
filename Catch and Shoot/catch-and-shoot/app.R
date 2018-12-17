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
filteredata <- pbpshort
namesdf <- pbpshort %>% separate(PLAYER_NAME, c("First", "Last", "Suffix"), remove = FALSE, sep = " ") %>% arrange(Last)
# pbpOpp <-  pbpshort %>% filter(OPPONENT %in% input$selectOpponent)
# pbpGame <- pbpshort %>% filter(DATE_OPPONENT %in% input$selectGame)
# 

ui <- fluidPage(
  tags$head(
    tags$link(rel = "stylesheet", type = "text/css", href = "styles.css"),
    
    # tags$script(src="d3moji.js"),
    tags$script(src="//twemoji.maxcdn.com/2/twemoji.min.js?11.2")
    # tags$script(src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js")
    # tags$link(href="https://fonts.googleapis.com/css?family=Gothic+A1", rel="stylesheet")
  ),
  
  titlePanel("NBA Emoji Charts"),
  
  
  sidebarLayout(
    sidebarPanel(
      width = 3,
      selectInput("selectPlayer", "Select your player:",unique(namesdf$PLAYER_NAME)),
      selectInput("selectLocation", "Home or Away:",unique(pbpshort$HOMEAWAY), multiple = TRUE),
      selectInput("selectOpponent", "Opponent(s):",NULL, multiple = TRUE),
      selectInput("selectGame", "Game(s):",unique(pbpshort$DATE_OPPONENT), multiple = TRUE),
      selectInput("selectPeriod", "Period(s):",unique(pbpshort$PERIOD), multiple = TRUE),
      selectInput("selectType", "Emoji Style:", c("Open and Closed","Xs and Os","Bballs and Bricks", "Splash and Thumbs Down","Okay and Facepalm",
                                                  "Thumbs Up and Nope"))
      
    ),
    mainPanel(
      
      
      tabsetPanel(type = "tabs",id = "inTabset",
                  # tabPanel("Overview",
                  #          tags$div(class = "plotContainer",
                  #                   selectInput("selectTeams", "Limit to specific teams:",unique(teamsdf$TEAM), multiple = TRUE),
                  #                   d3Output("mainPlot"),
                  #                   tableOutput('mainTable')
                  #          ) 
                  # ),
                  tabPanel("Bohr Shot Diagram", 
                           value="Player",
                           tags$h4("The Borh atomic model is probably the model you learned in high school chemistry. The Bohr
                                   model is a simplified model of the atom and is useful for understanding the basics but lacks the details of
                                   quantum mechanics. The Bohr shot diagram is similar, as it models only distance and lacks details available 
                                   in tracking data. Oh well, at least we can emojify it."),
                           # selectInput("selectPlayer", "Select your player:",unique(namesdf$PLAYER)),
                           # selectInput("selectPeriod", "Periods:",unique(pbpshort$PERIOD), multiple = TRUE),
                           # selectInput("selectBohrType", "Emoji Style:", c("Open and Closed","Xs and Os","Bballs and Bricks")),
                           d3Output("playerPlot"),
                           # d3Output("playerShotPlot"),
                           fluidRow(
                             column(width = 6, tableOutput('playerTable')),
                             column(width = 6, h2("EFG", br(), textOutput("efgLabel"))))
                        
                  ),
                  tabPanel("Shot Chart", 
                           value="shotchart",
                           # selectInput("selectPlayerShot", "Select your player:",unique(namesdf$PLAYER)),
                           # selectInput("selectPeriodShot", "Periods:",unique(pbpshort$PERIOD), multiple = TRUE),
                           # selectInput("selectShotType", "Emoji Style:", c("Open and Closed","Xs and Os","Bballs and Bricks")),
                           fluidRow(column(width = 7,d3Output("shotChart")),
                           # fluidRow(
                             column(width = 5, tableOutput('shotTable')),
                             column(width = 5,offset = 7, h2("EFG", br(), textOutput("shotLabel"))))
                           
                  )
      )
      # tags$div(class = "footer",
      #          tags$div(class = "footerItem",
      #                   tags$p("Made by ",
      #                          tags$a(href="https://twitter.com/scottyla1", "@scottyla1"))
      #          ),
      #          tags$div(class = "footerItem",
      #                   tags$p("Data provided by ",
      #                          tags$a(href="https://www.stats.nba.com", "NBA Stats")
      #                         
      #                   )
      #          )
      # )
    )
  )
  
    
  )
  
server <- function(input, output, session) {
  observe({
    filtData <- pbpshort %>% filter(PLAYER_NAME %in% input$selectPlayer &!is.na(SHOT_DISTANCE))
    uniqpr <- filtData %>% arrange(PERIOD)
    # x <- input$selectPlayer
    if (isTruthy(input$selectLocation)) {
      filtData <-  filtData %>% filter(HOMEAWAY %in% input$selectLocation)
    }
    if (isTruthy(input$selectOpponent)) {
      filtData <-  filtData %>% filter(OPPONENT %in% input$selectOpponent)
    }
    if (isTruthy(input$selectGame)) {
      filtData <-  filtData %>% filter(DATE_OPPONENT %in% input$selectGame)
    }
    
    if (isTruthy(input$selectPeriod)) {
      filtData <-  filtData %>% filter(PERIOD %in% input$selectPeriod) %>% arrange(PERIOD)
    }
    # # Can use character(0) to remove all choices
    # if (is.null(x))
    #   x <- character(0)
    # 
    # Can also set the label and select items
    updateSelectInput(session, "selectOpponent",
                      
                      choices = unique(filtData$OPPONENT)
                      
    )
    
    updateSelectInput(session, "selectGame",
                      
                      choices = unique(filtData$DATE_OPPONENT)
                      
    )
    updateSelectInput(session, "selectPeriod",
                      
                      choices = unique(uniqpr$PERIOD)
                      
    )
  })
  
  
  # observeEvent(input$selectPlayer, {
  #   updateSelectInput(session, "selectOpponent",
  #                     
  #                     choices =  unique(filteredata$OPPONENT)
  #                     
  #   )
  #   # updateSelectInput(session, "selectPlayer",
  #   #                   selected = input$Player
  #   # )
  #   # updateTabsetPanel(session, "inTabset",
  #   #                   selected = "Player"
  #   # )
  # })
  # 
  
  # output$mainPlot <- renderD3({
  # 
  #   filterdata <- efg
  #   if (!isTruthy(input$selectTeams)) {
  #     filterdata <- efg
  #   } else{
  #     filterdata <-  efg %>% mutate(isSelected = ifelse(TEAM %in% input$selectTeams, isSelected, FALSE)) # filter(TEAM %in% input$selectTeams)
  #   }
  #   r2d3(
  #     data = filterdata ,
  #     script = "main-plot.js")
  #   
  # })
  
  output$playerPlot <- renderD3({
    filteredata <- pbpshort %>% filter(PLAYER_NAME %in% input$selectPlayer & !is.na(SHOT_DISTANCE))
    if (isTruthy(input$selectLocation)) {
      filteredata <-  filteredata %>% filter(HOMEAWAY %in% input$selectLocation)
    }
    if (isTruthy(input$selectOpponent)) {
      filteredata <-  filteredata %>% filter(OPPONENT %in% input$selectOpponent)
    }
    if (isTruthy(input$selectGame)) {
      filteredata <-  filteredata %>% filter(DATE_OPPONENT %in% input$selectGame)
    }
    
    if (isTruthy(input$selectPeriod)) {
      filteredata <-  filteredata %>% filter(PERIOD %in% input$selectPeriod)
    }
    r2d3(
      data = filteredata,
      script = "bohr-shot-diagram.js",
      options = list(emoji = input$selectType))
    
  })
  
  output$shotChart <- renderD3({
    filteredata <- pbpshort %>% filter(PLAYER_NAME %in% input$selectPlayer & !is.na(SHOT_DISTANCE))
    
    if (isTruthy(input$selectLocation)) {
      filteredata <-  filteredata %>% filter(HOMEAWAY %in% input$selectLocation)
    }
    if (isTruthy(input$selectOpponent)) {
      filteredata <-  filteredata %>% filter(OPPONENT %in% input$selectOpponent)
    }
    if (isTruthy(input$selectGame)) {
      filteredata <-  filteredata %>% filter(DATE_OPPONENT %in% input$selectGame)
    }
   
    if (isTruthy(input$selectPeriod)) {
      filteredata <-  filteredata %>% filter(PERIOD %in% input$selectPeriod)
    }
    r2d3(
      data = filteredata,
      script = "shot-chart.js",
      # width= "1000px",
      # height = "1000px",
      options = list(emoji = input$selectType))
    
  })
  
  # output$playerTable <- renderTable(efg %>% filter(PLAYER==input$selectPlayer))
  output$playerTable <- renderTable({
    filteredata <- pbpshort %>% filter(PLAYER_NAME %in% input$selectPlayer & !is.na(SHOT_DISTANCE))
    
    if (isTruthy(input$selectLocation)) {
      filteredata <-  filteredata %>% filter(HOMEAWAY %in% input$selectLocation)
    }
    if (isTruthy(input$selectOpponent)) {
      filteredata <-  filteredata %>% filter(OPPONENT %in% input$selectOpponent)
    }
    if (isTruthy(input$selectGame)) {
      filteredata <-  filteredata %>% filter(DATE_OPPONENT %in% input$selectGame)
    }
    
    if (isTruthy(input$selectPeriod)) {
      filteredata <-  filteredata %>% filter(PERIOD %in% input$selectPeriod)
    }

    stats <- filteredata %>% group_by(PLAYER_NAME, RANGE) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                                 FG_PERCENTAGE = FGM/FGA, PPS =sum(SHOT_MADE_FLAG * SHOT_VALUE/FGA))
    stats %>%
      arrange(factor(RANGE, levels = c("RIM","SMR","LMR","3PT")))
  })
  
  output$efgLabel <- renderText({
    filteredata <- pbpshort %>% filter(PLAYER_NAME %in% input$selectPlayer & !is.na(SHOT_DISTANCE))
    
    if (isTruthy(input$selectLocation)) {
      filteredata <-  filteredata %>% filter(HOMEAWAY %in% input$selectLocation)
    }
    if (isTruthy(input$selectOpponent)) {
      filteredata <-  filteredata %>% filter(OPPONENT %in% input$selectOpponent)
    }
    if (isTruthy(input$selectGame)) {
      filteredata <-  filteredata %>% filter(DATE_OPPONENT %in% input$selectGame)
    }
    
    if (isTruthy(input$selectPeriod)) {
      filteredata <-  filteredata %>% filter(PERIOD %in% input$selectPeriod)
    }
    
    stats <- filteredata %>% group_by(PLAYER_NAME) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                                       PTS  = sum(SHOT_MADE_FLAG * SHOT_VALUE), EFG = PTS/(FGA*2))
    sprintf("%.*f%%", 1,100*stats$EFG)
  
  })
  
  output$shotTable <- renderTable({
    filteredata <- pbpshort %>% filter(PLAYER_NAME %in% input$selectPlayer & !is.na(SHOT_DISTANCE))
    
    if (isTruthy(input$selectLocation)) {
      filteredata <-  filteredata %>% filter(HOMEAWAY %in% input$selectLocation)
    }
    if (isTruthy(input$selectOpponent)) {
      filteredata <-  filteredata %>% filter(OPPONENT %in% input$selectOpponent)
    }
    if (isTruthy(input$selectGame)) {
      filteredata <-  filteredata %>% filter(DATE_OPPONENT %in% input$selectGame)
    }
    
    if (isTruthy(input$selectPeriod)) {
      filteredata <-  filteredata %>% filter(PERIOD %in% input$selectPeriod)
    }
    
    stats <- filteredata %>% group_by(PLAYER_NAME, RANGE) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                                        FG_PERCENTAGE = FGM/FGA, PPS =sum(SHOT_MADE_FLAG * SHOT_VALUE/FGA))
    stats <- stats %>%
      arrange(factor(RANGE, levels = c("RIM","SMR","LMR","3PT")))
    
  })
  
  output$shotLabel <- renderText({
    filteredata <- pbpshort %>% filter(PLAYER_NAME %in% input$selectPlayer & !is.na(SHOT_DISTANCE))
    
    if (isTruthy(input$selectLocation)) {
      filteredata <-  filteredata %>% filter(HOMEAWAY %in% input$selectLocation)
    }
    if (isTruthy(input$selectOpponent)) {
      filteredata <-  filteredata %>% filter(OPPONENT %in% input$selectOpponent)
    }
    if (isTruthy(input$selectGame)) {
      filteredata <-  filteredata %>% filter(DATE_OPPONENT %in% input$selectGame)
    }
    
    if (isTruthy(input$selectPeriod)) {
      filteredata <-  filteredata %>% filter(PERIOD %in% input$selectPeriod)
    }
    
    stats <- filteredata %>% group_by(PLAYER_NAME) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                                 PTS  = sum(SHOT_MADE_FLAG * SHOT_VALUE), EFG = PTS/(FGA*2))
    sprintf("%.*f%%", 1,100*stats$EFG)
    
  })
  
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
