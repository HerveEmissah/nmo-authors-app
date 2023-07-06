# nmo-authors-app
Frontend React App to search & fetch nmo literature citations given a pmid or doi 
#To build container: 
sudo docker build -t nmo-authors-app:dev . 
#To run the container: 
sudo docker run -it --rm --name nmo-authors-app -p 8181:80 nmo-authors-app:dev 
 
#Create Network to proxy request from frontend to backend API
#Connect backend to network 
sudo docker network connect nmo_network nmo_bibliometric_analysis_web_1 
#connect db to network 
sudo docker network connect nmo_network nmo_bibliometric_analysis_db_1 
#connect front end to network 
sudo docker network connect nmo_network nmo-authors-app 
#To inpect the containers running on network 
sudo docker network inspect nmo_network
