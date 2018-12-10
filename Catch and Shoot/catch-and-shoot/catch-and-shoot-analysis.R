library(shiny)
library(r2d3)
library(tidyverse)
library(stringr)
efg <- read.csv('cs-over-50-fga.csv')
namesdf <- efg %>% separate(PLAYER, c("First", "Last", "Suffix"), remove = FALSE, sep = " ") %>% arrange(Last)
teamsdf <- efg %>%  arrange(TEAM)
efg$FGM2 <- efg$FGM - efg$X3PM
efg$FGA2 <- efg$FGA - efg$X3PA
efg$FG2Percent <- efg$FGM2/ efg$FGA2

efg[is.na(efg)] <- 0
efg.pca <- prcomp(efg[,c(4:12,14:16)] ,center = TRUE,scale. = TRUE)
summary(efg.pca)

efg$isSelected <- TRUE
shots <- read.csv("shotcharts-2018-19.csv")
# pbp <- read.csv('jumpshots-11-25.csv')

# pbp$shotType <- "2PT"
# pbp$shotType[str_detect(pbp$HOMEDESCRIPTION, "3PT") | str_detect(pbp$VISITORDESCRIPTION, "3PT")]<- '3PT'
# 
# pbp$shotOutcome <- "MAKE"
# pbp$shotOutcome[str_detect(pbp$HOMEDESCRIPTION, "MISS") | str_detect(pbp$VISITORDESCRIPTION, "MISS")]<- 'MISS'

# pbp <- pbp %>% unite(shotGroup, shotType,shotOutcome, sep = "-", remove = FALSE)
# pbp <- pbp %>% unite(desc_combined, HOMEDESCRIPTION,VISITORDESCRIPTION, sep = " ", remove = FALSE)

jumpshots <- shots %>% filter(ACTION_TYPE == "Jump Shot" & SHOT_DISTANCE < 40)
# pbp <- pbp %>% filter(!str_detect(desc_combined, "Running|Fadeway|Turnaround"))
# pbp$shotLength <- str_extract( pbp$desc_combined, "\\d+(?=\\')")

jumpShotshort <- jumpshots %>% select(GAME_ID, TEAM_ID,PERIOD, ACTION_TYPE,MINUTES_REMAINING, SECONDS_REMAINING, PLAYER_ID, PLAYER_NAME, EVENT_TYPE, SHOT_TYPE, SHOT_ZONE_BASIC, SHOT_ZONE_AREA, SHOT_ZONE_RANGE,
                             SHOT_DISTANCE, LOC_X, LOC_Y, HTM, VTM)
                         
allShotShort <- shots %>% select(GAME_ID, TEAM_ID,PERIOD, ACTION_TYPE,MINUTES_REMAINING, SECONDS_REMAINING, PLAYER_ID, PLAYER_NAME, EVENT_TYPE, SHOT_TYPE, SHOT_ZONE_BASIC, SHOT_ZONE_AREA, SHOT_ZONE_RANGE,
                                 SHOT_DISTANCE, LOC_X, LOC_Y, HTM, VTM)
# pbpshort <- pbp %>% select(PERIOD, PCTIMESTRING, desc_combined, SCORE, SCOREMARGIN, 
#                            PLAYER1_NAME, PLAYER1_TEAM_ABBREVIATION, PLAYER1_TEAM_CITY, PLAYER1_TEAM_NICKNAME, shotType, shotOutcome, shotGroup, shotLength)

logs <- read.csv('all-game-logs.csv')

jumplogs <- merge(jumpShotshort,logs,by.x= c("GAME_ID", "TEAM_ID"),by.y=c("Game_ID","Team_ID"))

alllogs <- merge(allShotShort,logs,by.x= c("GAME_ID", "TEAM_ID"),by.y=c("Game_ID","Team_ID"))
# pbpLogShort <- pbplogs %>% select(PERIOD, PCTIMESTRING, desc_combined, SCORE, SCOREMARGIN, 
#                            PLAYER1_NAME, PLAYER1_TEAM_ABBREVIATION, PLAYER1_TEAM_CITY, PLAYER1_TEAM_NICKNAME, 
#                            shotType, shotOutcome, shotGroup, shotLength, GAME_DATE, MATCHUP, WL
#                            )
# 
jumplogShort <- jumplogs %>% select(GAME_ID, TEAM_ID,PERIOD, ACTION_TYPE,MINUTES_REMAINING, SECONDS_REMAINING, PLAYER_ID, PLAYER_NAME, EVENT_TYPE, SHOT_TYPE, SHOT_ZONE_BASIC, SHOT_ZONE_AREA, SHOT_ZONE_RANGE,
                             SHOT_DISTANCE, LOC_X, LOC_Y, HTM, VTM,GAME_DATE, MATCHUP, WL)
jumplogShort$HOMEAWAY <- "Away"
jumplogShort$HOMEAWAY[str_detect(jumplogShort$MATCHUP, "vs") ]<- "Home"
jumplogShort$OPPONENT <-str_sub(jumplogShort$MATCHUP,-3)

jumplogShort$DATE_OPPONENT <- paste(jumplogShort$GAME_DATE, str_sub(jumplogShort$MATCHUP,5), sep = " ")

allLogShort <- alllogs %>% select(GAME_ID, TEAM_ID,PERIOD, ACTION_TYPE,MINUTES_REMAINING, SECONDS_REMAINING, PLAYER_ID, PLAYER_NAME, EVENT_TYPE, SHOT_TYPE, SHOT_ZONE_BASIC, SHOT_ZONE_AREA, SHOT_ZONE_RANGE,
                                  SHOT_DISTANCE, LOC_X, LOC_Y, HTM, VTM,GAME_DATE, MATCHUP, WL)
allLogShort$HOMEAWAY <- "Away"
allLogShort$HOMEAWAY[str_detect(allLogShort$MATCHUP, "vs") ]<- "Home"
allLogShort$OPPONENT <-str_sub(allLogShort$MATCHUP,-3)

allLogShort$DATE_OPPONENT <- paste(allLogShort$GAME_DATE, str_sub(allLogShort$MATCHUP,5), sep = " ")


 write_csv(jumplogShort, "jump-log-short.csv")
 write_csv(allLogShort, "all-log-short.csv")
 
 
 
