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


longTeam <- read.csv("longTeamByRange.csv")

teamsdf<- longTeam %>% arrange(TEAM_ABRV) %>% filter(TEAM_ABRV != "All")
pbpshort <- read.csv('all-log-short.csv')
filteredata <- pbpshort
namesdf <- pbpshort %>% separate(PLAYER_NAME, c("First", "Last", "Suffix"), remove = FALSE, sep = " ") %>% arrange(Last)


ui <- fluidPage(
  tags$head(
    tags$link(rel = "stylesheet", type = "text/css", href = "styles.css"),
    
    # tags$script(src="d3moji.js"),
    tags$script(src="//twemoji.maxcdn.com/2/twemoji.min.js?11.2")
    # tags$script(src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.min.js")
    # tags$link(href="https://fonts.googleapis.com/css?family=Gothic+A1", rel="stylesheet")
  ),
  
  titlePanel("NBA Shot Range Emoji Charts"),
  tags$h3 ("🏀 + 📊 = ❤️️"),
  
  
  sidebarLayout(
    sidebarPanel(
      width = 3,
      conditionalPanel(
        condition = "input.inTabset != 'overview'",
        selectInput("selectPlayer", "Select your player:",unique(namesdf$PLAYER_NAME)),
        selectInput("selectLocation", "Home or Away:",unique(pbpshort$HOMEAWAY), multiple = TRUE),
        selectInput("selectOpponent", "Opponent(s):",NULL, multiple = TRUE),
        selectInput("selectGame", "Game(s):",unique(pbpshort$DATE_OPPONENT), multiple = TRUE),
        selectInput("selectPeriod", "Period(s):",unique(pbpshort$PERIOD), multiple = TRUE),
        selectInput("selectType", "Emoji Style:", c("Open and Closed","Xs and Os","Bballs and Bricks", "Splash and Thumbs Down","Okay and Facepalm",
                                                    "Thumbs Up and Nope"))
      ),
      
      conditionalPanel(
        condition = "input.inTabset == 'overview'",
        selectInput("selectTeam", "Select your team(s):",unique(teamsdf$TEAM_ABRV), multiple = TRUE),
        selectInput("selectStat", "Select your Stat:",c("Percentage of shots at range", "Points per shot (PPS)"))
      
      
    )
    ),
    mainPanel(
      
      
      tabsetPanel(type = "tabs",id = "inTabset",
                  tabPanel("Overview",
                           value = "overview",
                           
                                    d3Output("barPlot")
                           )
                  ,
                  tabPanel("Bohr Shot Diagram", 
                           value="Player",
                           tags$h4("The Bohr atomic model is most likely the model of the atom you learned in high school chemistry. The Bohr
                                   model is a simplified model of the atom and is useful for understanding the basics but lacks the details of
                                   quantum mechanics. The Bohr shot diagram is similar, as it models only distance and lacks details available 
                                   in tracking data. Oh well, at least we can emojify it."),
                          
                           d3Output("playerPlot"),
                           fluidRow(
                             column(width = 6, tableOutput('playerTable')),
                             column(width = 6, h2("EFG", br(), textOutput("efgLabel"))))
                           
                           ),
                  tabPanel("Shot Chart", 
                           value="shotchart",
                           
                           fluidRow(column(width = 7,d3Output("shotChart")),
                                    
                                    column(width = 4,tableOutput('shotTable')),
                                    column(width = 3, offset =9, h2("EFG", br(), textOutput("shotLabel"))))
                           
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
    if (isTruthy(input$selectPlayer)) {
      
      updateSelectInput(session, "selectOpponent",
                        selected = input$selectOpponent,
                        choices = unique(filtData$OPPONENT)
                        
      )
      
      updateSelectInput(session, "selectGame",
                        selected = input$selectGame,
                        choices = unique(filtData$DATE_OPPONENT)
                        
      )
      updateSelectInput(session, "selectPeriod",
                        selected = input$selectPeriod,
                        choices = unique(uniqpr$PERIOD)
                        
      )
    }
    if (isTruthy(input$selectLocation)) {
      filtData <-  filtData %>% filter(HOMEAWAY %in% input$selectLocation)
      updateSelectInput(session, "selectOpponent",
                        selected = input$selectOpponent,
                        choices = unique(filtData$OPPONENT)
                        
      )
      
      updateSelectInput(session, "selectGame",
                        selected = input$selectGame,
                        choices = unique(filtData$DATE_OPPONENT)
                        
      )
      updateSelectInput(session, "selectPeriod",
                        selected = input$selectPeriod,
                        choices = unique(uniqpr$PERIOD)
                        
      )
    }
    if (isTruthy(input$selectOpponent)) {
      filtData <-  filtData %>% filter(OPPONENT %in% input$selectOpponent)
      
      
      updateSelectInput(session, "selectGame",
                        selected = input$selectGame,
                        choices = unique(filtData$DATE_OPPONENT)
                        
      )
      updateSelectInput(session, "selectPeriod",
                        selected = input$selectPeriod,
                        choices = unique(uniqpr$PERIOD)
                        
      )
    }
    if (isTruthy(input$selectGame)) {
      filtData <-  filtData %>% filter(DATE_OPPONENT %in% input$selectGame)
     
      updateSelectInput(session, "selectPeriod",
                        selected = input$selectPeriod,
                        choices = unique(uniqpr$PERIOD)
                        
      )
    }
    
    if (isTruthy(input$selectPeriod)) {
      filtData <-  filtData %>% filter(PERIOD %in% input$selectPeriod) %>% arrange(PERIOD)
    }
    
  })
  
  
  
  
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
  output$barPlot <- renderD3({
    filterdata <- longTeam %>% spread(TEAM_ABRV,shotRangeRatio) %>% select(c(1,12:ncol(.)))%>%group_by(RANGE) %>%
      summarise_all(funs(na.omit(.)[1]))
    
    if (input$selectStat == "Points per shot (PPS)") {
      
      filterdata <-  longTeam %>% spread(TEAM_ABRV,PPS_range) %>% 
        select(c(1,12:ncol(.)))%>%group_by(RANGE) %>% summarise_all(funs(na.omit(.)[1])) 
    }
    
    if (isTruthy(input$selectTeam)) {
      
      filterdata <-  longTeam %>% filter(TEAM_ABRV %in% input$selectTeam |  TEAM_ABRV == 'All') %>% spread(TEAM_ABRV,shotRangeRatio) %>% 
        select(c(1,12:ncol(.)))%>%group_by(RANGE) %>% summarise_all(funs(na.omit(.)[1])) 
      
      if (input$selectStat == "Points per shot (PPS)") {
        
        filterdata <-  longTeam %>% filter(TEAM_ABRV %in% input$selectTeam |  TEAM_ABRV == 'All') %>% spread(TEAM_ABRV,PPS_range) %>% 
          select(c(1,12:ncol(.)))%>%group_by(RANGE) %>% summarise_all(funs(na.omit(.)[1])) 
      }
    }
    
    filterdata <- filterdata %>%
      arrange(factor(RANGE, levels = c("RIM","SMR","LMR","3PT")))
    
    r2d3(
      data = filterdata ,
      script = "bar-plot.js",
      options = list(stat = input$selectStat))
    
  })
  
  
}


# Run the application 
shinyApp(ui = ui, server = server)
