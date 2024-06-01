# Plant-Disease-Classification

# powershell comand
# docker
docker pull tensorflow/serving

# To Start docker container

### This directory peeeper disease classification

docker run -it -v D:\plant\peeper-disease:/peeper-disease -p 8501:8501 --entrypoint /bin/bash tensorflow/serving

### This directory potato disease classification
docker run -it -v D:\plant\potato-disease:/potato-disease -p 8601:8601 --entrypoint /bin/bash tensorflow/serving

### This directory tomato disease classification
docker run -it -v D:\plant\tomato-disease:/tomato-disease -p 8701:8701 --entrypoint /bin/bash tensorflow/serving

# To serve only latest models

### peeeper disease classification
tensorflow_model_server --rest_api_port=8501 --model_name=peeper-disease --model_base_path=/peeper-disease/Models/

### potato disease classification
tensorflow_model_server --rest_api_port=8601 --model_name=potato-disease --model_base_path=/potato-disease/Models/

### tomato disease classification
tensorflow_model_server --rest_api_port=8701 --model_name=tomato-disease --model_base_path=/tomato-disease/Models/


 ## here’s a brief description of how disease detection works for tomato, potato, and pepper plants using leaf images:

## Tomato:-
 Deep learning techniques, particularly Convolutional Neural Networks (CNNs), have been used to detect and classify diseases in tomato plants.For instance, a CNN-based technique was used to detect diseases in tomato crops. Another study used a deep learning-based system utilizing the plant leaves image data

 ## Potato:-

 Similar to tomato plants, potato leaf diseases have also been detected using deep learning techniques345. A study used a CNN model to classify potato leaf diseases .

## Peeper:-

For pepper plants, an enhanced lightweight model based on GoogLeNet architecture was introduced for disease detection.

[![Watch the video](https://vimeo.com/929143932)](https://vimeo.com/929143932)
