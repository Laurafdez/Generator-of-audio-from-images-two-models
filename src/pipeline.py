from flask import Flask, request, jsonify
import open_clip
import torch
import subprocess
from PIL import Image
from diffusers import AudioLDMPipeline
from torchvision.transforms.functional import to_pil_image
from scipy.io.wavfile import write
from flask_cors import CORS
import requests
from PIL import Image
import torchvision.transforms as transforms
import soundfile as sf
import numpy as np
import os

app = Flask(__name__)
CORS(app)



# Transformación para preprocesar la imagen
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
])

@app.route('/generate_output', methods=['POST'])
def generate_output():
    data = request.get_json()
    input_text = data.get('inputText', '')
    url = data.get('inputText', '')
    if not url:
        return jsonify({'error': 'No se proporcionó una URL'})


    model, _, transform = open_clip.create_model_and_transforms(
        model_name="coca_ViT-L-14",
        pretrained="mscoco_finetuned_laion2B-s13B-b90k"
    )

    # Obtener la ruta completa de la carpeta public/assets
    assets_dir = 'C:/Users/laura/Documents/Amazon/my-app/public/assets'
    filename = os.path.join(assets_dir, 'output.jpg')


    response = requests.get(url)

    with open(filename, 'wb') as f:
        f.write(response.content)

    im = Image.open(filename).convert('RGB')
    im = transform(im).unsqueeze(0)
    

    

    with torch.no_grad(), torch.cuda.amp.autocast():
        generated = model.generate(im)

    output = open_clip.decode(generated[0]).split("<end_of_text>")[0].replace("<start_of_text>", "")

    repo_id = "cvssp/audioldm"
    pipe = AudioLDMPipeline.from_pretrained(repo_id, torch_dtype=torch.float16)
    pipe = pipe.to("cuda")

    audio = pipe(output, num_inference_steps=10, audio_length_in_s=5.0).audios[0]
    
    audio = audio.astype(np.float32)

    # Guardar audio
    audio_filename = os.path.join(assets_dir, 'output.wav')
    sf.write(audio_filename, audio,samplerate=16000)
    print("Audio guardado en output.wav")

    # Guardar texto generado en un archivo local

    assets_dir = 'C:/Users/laura/Documents/Amazon/my-app/public/assets'
    filename1 = os.path.join(assets_dir, 'texto_generado.txt')
    with open(filename1, 'w') as f:
       f.write(output)
       print("Texto guardado en texto_generado.txt")

    return jsonify({'text': output})


if __name__ == '__main__':
    app.run(debug=True)

    


