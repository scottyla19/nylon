
library(tidyverse)
library(stringr)

pbp <- read.csv('all-log-short.csv')
playerStatsByRange <- pbp %>% group_by(PLAYER_NAME, RANGE) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                                    FG_PERCENTAGE = FGM/FGA, PPS =sum(SHOT_MADE_FLAG * SHOT_VALUE/FGA))
playerStats <- pbp %>% group_by(PLAYER_NAME) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                      PTS  = sum(SHOT_MADE_FLAG * SHOT_VALUE), EFG = PTS/(FGA*2))

teamStatsByRange <- pbp %>% group_by(TEAM_NAME, RANGE) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                                         FG_PERCENTAGE = FGM/FGA, PPS =sum(SHOT_MADE_FLAG * SHOT_VALUE/FGA))
teamStats <- pbp %>% group_by(TEAM_NAME) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                           PTS  = sum(SHOT_MADE_FLAG * SHOT_VALUE), EFG = PTS/(FGA*2))

statsByRange <- pbp %>% group_by( RANGE) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                                   FG_PERCENTAGE = FGM/FGA, PPS =sum(SHOT_MADE_FLAG * SHOT_VALUE/FGA),
                                                       TOTAL_SHOTS = sum(.$SHOT_ATTEMPTED_FLAG))
totalStats <- pbp %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                     PTS  = sum(SHOT_MADE_FLAG * SHOT_VALUE), EFG = PTS/(FGA*2))

playerStatsByRange <- playerStatsByRange %>% merge(playerStats, by = "PLAYER_NAME", suffixes = c("_range","_total"))
teamStatsByRange <- teamStatsByRange %>% merge(teamStats, by = "TEAM_NAME", suffixes = c("_range","_total"))

playerStatsByRange$shotRangeRatio <- playerStatsByRange$FGA_range/playerStatsByRange$FGA_total
teamStatsByRange$shotRangeRatio <- teamStatsByRange$FGA_range/teamStatsByRange$FGA_total

rimPlayer <- playerStatsByRange %>% filter(RANGE == "RIM") %>% arrange(desc(shotRangeRatio), desc(EFG))
rimTeam <- teamStatsByRange %>% filter(RANGE == "RIM") %>% arrange(desc(shotRangeRatio), desc(EFG))

smrPlayer <- playerStatsByRange %>% filter(RANGE == "SMR") %>% arrange(desc(shotRangeRatio), desc(EFG))
smrTeam <- teamStatsByRange %>% filter(RANGE == "SMR") %>% arrange(desc(shotRangeRatio), desc(EFG))

lmrPlayer <- playerStatsByRange %>% filter(RANGE == "LMR") %>% arrange(desc(shotRangeRatio), desc(EFG))
lmrTeam <- teamStatsByRange %>% filter(RANGE == "LMR") %>% arrange(desc(shotRangeRatio), desc(EFG))

threePlayer <- playerStatsByRange %>% filter(RANGE == "3PT") %>% arrange(desc(shotRangeRatio), desc(EFG))
threeTeam <- teamStatsByRange %>% filter(RANGE == "3PT") %>% arrange(desc(shotRangeRatio), desc(EFG))
