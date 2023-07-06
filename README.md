# nmo-authors-app
Frontend React App to search & fetch nmo literature citations given a pmid or doi. </br></br>
#Build container: </br>
docker build -t nmo-authors-app:dev . </br></br>
#Run the container: </br>
docker run -it --rm --name nmo-authors-app -p 8181:80 nmo-authors-app:dev </br></br> 
#Create Network to proxy request from fron-tend to back-end API </br>
docker network create nmo-authors-app </br></br>
#connect front end to network: </br> 
docker network connect nmo_network nmo-authors-app </br></br>
#Connect backend to network: </br> 
docker network connect nmo_network nmo_bibliometric_analysis_web_1 </br></br>
#connect db to network </br> 
docker network connect nmo_network nmo_bibliometric_analysis_db_1 </br></br>
#To inpect the containers running on network </br> 
docker network inspect nmo_network
