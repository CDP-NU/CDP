library(haven)
# precinct <-  read_dta("precinctALLshortr.dta")
# precinct<- subset(precinct, !is.na(precinct["raceid"]))
# precinct[precinct==""] <- NA
# precinct_unique <- unique(precinct[,])
# write.csv(precinct, file = "database8/precinctALLshortr.csv", na="", row.names=FALSE)
# 
# 
# ward <- read_dta("wardALLshortr.dta")
# ward[ward==""] <- NA
# ward <- subset(ward, !is.na(ward["raceid"]))
# write.csv(ward, file = "database8/wardALLshortr.csv", na="", row.names=FALSE)
# 
# precinct_race <- read.csv("database8/precinctALLshortr.csv")
precinct_dem <- read.csv("CDPDemographyACS2014Precinct2015Stacked.csv")
ward_dem<- read.csv("CDPDemographyACS2014Ward2015Stacked.csv")
