
library(tidyverse)
library(stringr)

shots <- read.csv("shotcharts-2018-19.csv")

grShots <- shots %>% 
  group_by(PLAYER_ID) %>% 
  summarise(FGA_TYPE = sum(SHOT_ATTEMPTED_FLAG),FGM_TYPE = sum(SHOT_MADE_FLAG))
                      

