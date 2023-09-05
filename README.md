# MlWebClient
This project is a web client for university 6th term coursework.

The project purpose is to provide web interface for uploading images.
The images are sent to recognition system backend server for processing.
User sees drawn bounding boxes of recognized project (dumpsters).

### Functionality
MlWebProject provides following features:
1. Wide range of supported image resolutions
2. Supported image extensions: .png, .jpg
3. Multicolor signed bounding boxes displaying
4. Backend server address selection from drop-down list
5. Hardcoded MOCK address in the server address drop-down 
list for standalone functionality demonstration

### Demonstration server
Demo version with mock backend server is available via running application link - http://194.31.173.36:10123

### Deployment
Docker image is available via link - https://hub.docker.com/repository/docker/rloutsker/ml-web-client/general
<br/>
The dockerfile can be found in project root directory: [dockerfile](dockerfile).

Example of the instruction for `docker compose up` command:
<pre>
<code>version: '2'
services:
  ml-web-client-service:
  image: 'rloutsker/ml-web-client:latest'
  container_name: 'ml-web-client'
  ports:
    - "10123:10123"
  environment:
    - ML_SERVER_ADDRESSES=http://localhost:10123,https://your.server:0000
    - SERVER_INTERNAL_PATH=/predictions/garbage_cont_classify 
</code>
</pre>

Environment variables explained:
1. ML_SERVER_ADDRESSES - list of backend server addresses, address in string separated by ',';
2. SERVER_INTERNAL_PATH - path that bound to recognition controller method
