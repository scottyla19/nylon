library(shiny)
library(r2d3)
library(tidyverse)
library(stringr)

shots <- read.csv("shotcharts-2018-19-Dec-10-18.csv")

                         
allShotShort <- shots %>% select(GAME_ID, TEAM_ID,TEAM_NAME,PERIOD, ACTION_TYPE,MINUTES_REMAINING, SECONDS_REMAINING, PLAYER_ID, PLAYER_NAME, EVENT_TYPE, SHOT_TYPE, SHOT_ZONE_BASIC, SHOT_ZONE_AREA, SHOT_ZONE_RANGE,
                                 SHOT_ATTEMPTED_FLAG, SHOT_MADE_FLAG,SHOT_DISTANCE, LOC_X, LOC_Y, HTM, VTM)

logs <- read.csv('all-game-logs.csv')



alllogs <- merge(allShotShort,logs,by.x= c("GAME_ID", "TEAM_ID"),by.y=c("Game_ID","Team_ID"))


allLogShort <- alllogs %>% select(GAME_ID, TEAM_ID,TEAM_NAME,PERIOD, ACTION_TYPE,MINUTES_REMAINING, SECONDS_REMAINING, PLAYER_ID, PLAYER_NAME, EVENT_TYPE, SHOT_TYPE, SHOT_ZONE_BASIC, SHOT_ZONE_AREA, SHOT_ZONE_RANGE,
                                  SHOT_ATTEMPTED_FLAG, SHOT_MADE_FLAG,SHOT_DISTANCE, LOC_X, LOC_Y, HTM, VTM,GAME_DATE, MATCHUP, WL)
allLogShort$HOMEAWAY <- "Away"
allLogShort$HOMEAWAY[str_detect(allLogShort$MATCHUP, "vs") ]<- "Home"
allLogShort$OPPONENT <-str_sub(allLogShort$MATCHUP,-3)

allLogShort$DATE_OPPONENT <- paste(allLogShort$GAME_DATE, str_sub(allLogShort$MATCHUP,5), sep = " ")
allLogShort <- allLogShort %>% mutate(RANGE = ifelse(SHOT_DISTANCE < 4, "RIM",
                                                     ifelse(SHOT_DISTANCE >= 5 & SHOT_DISTANCE < 14, "SMR", 
                                                            ifelse(SHOT_DISTANCE > 14 & SHOT_TYPE == "2PT Field Goal", "LMR", 
                                                            ifelse(SHOT_DISTANCE >= 22 & SHOT_TYPE == "3PT Field Goal", "3PT", "LMR")))))
allLogShort <- allLogShort %>% mutate(SHOT_VALUE = ifelse(SHOT_TYPE == "3PT Field Goal", 3,2))

 
 write_csv(allLogShort, "all-log-short.csv")
 
 
 
