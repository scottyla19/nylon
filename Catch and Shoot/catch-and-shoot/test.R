
library(tidyverse)
library(stringr)


pbp <- read.csv('all-log-short.csv')
pbp$TEAM_ABRV <- substr(pbp$MATCHUP, 0, 3)
playerStatsByRange <- pbp %>% group_by(PLAYER_NAME, RANGE) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                                         FG_PERCENTAGE = FGM/FGA, PPS =sum(SHOT_MADE_FLAG * SHOT_VALUE/FGA),  PTS  = sum(SHOT_MADE_FLAG * SHOT_VALUE))
playerStats <- pbp %>% group_by(PLAYER_NAME) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                           PTS  = sum(SHOT_MADE_FLAG * SHOT_VALUE), EFG = PTS/(FGA*2), PPS = PTS/FGA)

teamStatsByRange <- pbp %>% group_by(TEAM_ABRV, RANGE) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                                     FG_PERCENTAGE = FGM/FGA, PPS =sum(SHOT_MADE_FLAG * SHOT_VALUE/FGA), PTS  = sum(SHOT_MADE_FLAG * SHOT_VALUE))
teamStats <- pbp %>% group_by(TEAM_ABRV) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                       PTS  = sum(SHOT_MADE_FLAG * SHOT_VALUE), EFG = PTS/(FGA*2), PPS = PTS/FGA)

statsByRange <- pbp %>% group_by( RANGE) %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
                                                       FG_PERCENTAGE = FGM/FGA, PPS =sum(SHOT_MADE_FLAG * SHOT_VALUE/FGA),
                                                       TOTAL_SHOTS = sum(.$SHOT_ATTEMPTED_FLAG))
# totalStats <- pbp %>% summarise(FGM = sum(SHOT_MADE_FLAG),FGA = sum(SHOT_ATTEMPTED_FLAG),
#                                                      PTS  = sum(SHOT_MADE_FLAG * SHOT_VALUE), EFG = PTS/(FGA*2), PPS = PTS/FGA)

playerStatsByRange <- playerStatsByRange %>% merge(playerStats, by = 'PLAYER_NAME', suffixes = c("_range","_total"))
teamStatsByRange <- teamStatsByRange %>% merge(teamStats, by = 'TEAM_ABRV', suffixes = c("_range","_total"))

playerStatsByRange$shotRangeRatio <- playerStatsByRange$FGA_range/playerStatsByRange$FGA_total
teamStatsByRange$shotRangeRatio <- teamStatsByRange$FGA_range/teamStatsByRange$FGA_total

rimPlayer <- playerStatsByRange %>% filter(RANGE == "RIM") %>% arrange(desc(PPS_range))#desc(shotRangeRatio), desc(EFG))
rimTeam <- teamStatsByRange %>% filter(RANGE == "RIM") %>% arrange(desc(PPS_range))#desc(shotRangeRatio), desc(EFG))

smrPlayer <- playerStatsByRange %>% filter(RANGE == "SMR") %>% arrange(desc(PPS_range))#desc(shotRangeRatio), desc(EFG))
smrTeam <- teamStatsByRange %>% filter(RANGE == "SMR") %>% arrange(desc(PPS_range))#desc(shotRangeRatio), desc(EFG))

lmrPlayer <- playerStatsByRange %>% filter(RANGE == "LMR") %>% arrange(desc(PPS_range))#desc(shotRangeRatio), desc(EFG))
lmrTeam <- teamStatsByRange %>% filter(RANGE == "LMR") %>% arrange(desc(PPS_range))#shotRangeRatio), desc(EFG))

threePlayer <- playerStatsByRange %>% filter(RANGE == "3PT") %>% arrange(desc(PPS_range))#desc(shotRangeRatio), desc(EFG))
threeTeam <- teamStatsByRange %>% filter(RANGE == "3PT") %>% arrange(desc(PPS_range))#shotRangeRatio), desc(EFG))
# 
# wideTeam <- rimTeam %>% merge(smrTeam, by = "TEAM_NAME", suffixes = c("_RIM","_SMR"))
# wideTeam <- wideTeam %>% merge(lmrTeam, by = "TEAM_NAME", suffixes = c("","_LMR"))
# wideTeam <- wideTeam %>% merge(threeTeam, by = "TEAM_NAME", suffixes = c("","_3PT"))


allNBA <- teamStatsByRange %>% group_by(RANGE) %>% summarise(TEAM_ABRV = "All" ,FGA_range = sum(FGA_range), FGM_range = sum(FGM_range), FG_PERCENTAGE = FGM_range/FGA_range,
                                                             PTS_range = sum(PTS_range), EFG = mean(EFG), FGM_total = sum(.$FGM_range), FGA_total = sum(.$FGA_range), PTS_total= sum(.$PTS_range),
                                                             PPS_range = PTS_range/FGA_range,shotRangeRatio = mean(shotRangeRatio), PPS_total = sum(.$PTS_range)/sum(.$FGA_range))
teamStatsByRange <- rbind(teamStatsByRange, allNBA)
# teamStatsByRange[,-1:-2] <- round(teamStatsByRange[,-1:-2],3)
# teamStatsByRange <- teamStatsByRange %>% add_row(allNBA)
# wideRatio <- teamStatsByRange %>% spread(TEAM_ABRV,shotRangeRatio) %>% select(c(1,12:ncol(.)))%>%group_by(RANGE) %>%
#   summarise_all(funs(na.omit(.)[1]))
# widePPS <- teamStatsByRange %>% spread(TEAM_ABRV,PPS_range)  %>% select("RANGE",'ATL':'WAS')%>%group_by(RANGE) %>%
#   summarise_all(funs(na.omit(.)[1]))

# 
# ggplot(data=teamStatsByRange, aes(x=TEAM_NAME, y=shotRangeRatio, fill=RANGE)) +
#   geom_bar(stat="identity", position=position_dodge())
# 
# ggplot(data=teamStatsByRange) +
#   geom_bar( aes(x=TEAM_NAME, y=PPS, fill=RANGE),stat="identity", position=position_dodge(), alpha= .5)+
#   geom_bar( aes(x=TEAM_NAME, y=shotRangeRatio, fill=RANGE),stat="identity", position=position_dodge())

write_csv(teamStatsByRange,"longTeamByRange.csv")
write_csv(pbp,"all-log-short.csv")

