
# Generator-of-audio-from-images

En este repositorio se encuentran registrado un pipeline que es capaz de generar audio cuando recibe como entrada una imagen. Para poder llevar a cabo este proceso se conectan dos modelos. 

## Contractiva Captioner (CoCa)

El primero es Contractiva Captioner (CoCa) es un modelo que dada una imagen es capaz de describir lo que ocurre en esa imagen. CoCa desarrolla su arquitectura siguiendo tres enfoques, primero usa el codificador de la imagen y el decodificador de texto para obtener las representaciones del texto unimodales, para ello, omite las primeras capas del decodificador. En el siguiente paso, se usan esas capas para obtener las representaciones multimodales de imagen y texto. Para entrenar CoCa se usa las pérdidas de constrante entre la salida del codificador de la imagen y el decodificador de texto unimodal, con lo que se consigue comparar las representaciones de imagen y de texto. También, se utilizan las pérdidas de generación de subtítulos en la salida del decodificador multimodal, que ayudan al modelo a predecir los tokens de texto de forma autorregresiva. Asimismo, esta forma de entrenamiento va a permitir que el modelo sea capaz de capturar tanto las características globales como regionales de las imágenes y de los textos. 

<div align="center">
  <img src="public/assets/CoCa1.png" width="300" height="300" />
</div>


Los datos que utiliza el modelo para entrenar son de baja calidad tanto los textos como las imágenes, esto permite que el modelo aprenda las representaciones genéricas y estas puedan ser transferidas a diferentes tareas realizando pequeñas adaptaciones o transferencia de conocimientos.


Coca es capaz de realizar una multitud de tareas: reconocimiento visual, generación de subtítulos de imágenes, comprensión multimodal, clasificar imágenes sin etiquetas, recuperar imágenes sin etiquetas... Adicionalmente, se ha demostrado que el modelo Contrastive Captioner (CoCa) supera a otros modelos gracias a que es capaz de realizar transferencia sin etiquetas.

## AudioLDM
El segundo modelo que se utiliza es AudioLDM surge como un sistema Text-to-audio(TTA) que usa un espacio latente para aprender las representaciones de audio continuas a partir del preentrenamiento constractivo de lenguaje-audio(CLAP). El modelo CLAP permite entrenar el espacio latente con embeddings de audio condicionados por los embeddings de texto, lo que permite que AudioLDM genere audios de calidad con una gran eficiencia computacional. Es decir, AudioLDM aprende a generar un audio en una primera estancia en un espacio latente codificado por un VAE, se desarrolla ese espacio latente condicionado por embeddings de audio y de texto constractivo preentrenado por CLAP. Este hecho permite que CLAP pueda generar sonido sin usar pares de datos de lenguaje-audio para entrenar el LDM. En definitiva, el modelo AudioLDM es un modelo que combina el preentrenamiento constractivo de lenguaje-audio(CLAP) con modelos de difusión latentes condicionados con el objetivo de generar audio de alta calidad a partir de descripciones de texto. En la siguiente figura se muestra la arquitectura de AudioLDM, se observa como se obtiene la muestra de audio y la de texto y gracias a CLAP y como con el VAE se consigue codificar un espacio latente condicionado del que se obten las muestras de audio generados :
<div align="center">
  <img src="public/assets/audioldm1.jpg" width="350" height="350" />
</div>
## Pipeline

Una vez explicados los modelos utilizados, se pasa a explicar la implementación seguida en el desarrollo del pipeline capaz de generar audio cuando recibe una imagen como entrada. Primero de todo, se estudió la forma en la que estaba implementado CoCa y como se podía usar dentro del pipeline. Se descubrió que en Huggingface está subido el código para poder usar CoCa. Este código lo que hace principalmente es tomar la imagen y generar una descripción para esa imagen. Se hizo el mismo proceso de búsqueda para el modelo AudioLDM, también se encontró una pequeño pipeline que es capaz de generar audio a partir de un texto. Con todo ello, se juntaron ambos modelos, se usó la descripción de la salida del primer modelo como entrada del segundo. El pipeline presenta la siguiente forma:
<div align="center">
  <img src="public/assets/pipeline.py.png"  height="150"  />
</div>

Una vez implementado, se crea una página Web para poner en funcionamiento dicho pipeline, en el que el usuario escribe la url de la imagen que quiere poner sonido y el generador de audio sonarizara dicha imagen.

<div align="center">
  <img src="public/assets/pipeline2.png" width="400" height="400" />
</div>

## Puesta en funcionamiento
1. Se clona el repositorio y se navega hasta donde esta el código:
   ```console
      git clone https://github.com/Laurafdez/Generator-of-audio-from-images.git
      ```
2. Se navega hasta donde esta el código:
   ```console
     cd /Generator-of-audio-from-images/src
      ```
       
2. Crea un entorno donde poner en funcionamiento el pipeline:
   ```console
     conda create --name pipeline
     ```
3. Se activa el entorno creado:
   ```console
     conda activate pipeline
     ```
4. Se instalan lsa dependecias del entorno:
   ```console
     pip install Flask open-clip torch Pillow diffusers torchvision scipy flask-cors requests soundfile numpy
     ```
5. Una vez instaladas todas las dependecias se procede a poner en funcionamiento el script pipeline.py
    ```console
       python pipeline.py
   ```

6. En otro terminal se crea otro entorno donde se ejecuta la aplicación de node:
    ```console
       conda create --name node_js
   ```
7. Se activa el entorno creado:
    ```console
       conda activate node_js
   ```
8.  Se instala node en el entorno:
    ```console
       conda install -c conda-forge nodejs
    ```
9.  Se mueve a donde esta el codigo:
    ```console
       cd src
    ```
10. Se instalan las dependecias:
    ```console
       npm install
    ```
11. Se corre la aplicación:
    ```console
       npm start
    ```
12. Ya esta la página Web corriendo y se pueden introducir la URL de las imágenes.

## References

1. Yu, J., Wang, Z., Vasudevan, V., Yeung, L., Seyedhosseini, M., & Wu, Y. (2022). Coca: Contrastive captioners are image-text foundation models. arXiv preprint arXiv:2205.01917.
2. Liu, H., Chen, Z., Yuan, Y., Mei, X., Liu, X., Mandic, D., ... & Plumbley, M. D. (2023). Audioldm: Text-to-audio generation with latent diffusion models. arXiv preprint arXiv:2301.12503.
