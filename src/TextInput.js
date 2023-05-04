import React, { Component } from 'react';

class TextInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputText: "",
      isLoading: false,
      error: null,
      image: null,
      audio: null,
      textFromFile: '',
      text: '',
    };
  }

  readTextFile = async () => {
    const response = await fetch('/assets/texto_generado.txt');
    const text = await response.text();
    this.setState({ textFromFile: text });
  }
  
  componentDidMount() {
    this.readTextFile();
  }
  
  handleInputChange = (event) => {
    this.setState({ inputText: event.target.value });
  };

  handleSubmit = async () => {
    const { inputText } = this.state;

    try {
      const response = await fetch('http://127.0.0.1:5000/generate_output', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });
  
      const result = await response.json();
       console.log(result)
     
        this.setState({
          isLoading: false,
          control: this.state.control +1,
          text: result.text,
        });
      
    } catch (error) {
      console.error(error);
      this.setState({ isLoading: false, error });
    }
  };
  

  render() {
    const { inputText, isLoading, error } = this.state;
    
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }}>
        <input type="text" value={inputText} onChange={this.handleInputChange} />
        <button onClick={this.handleSubmit}>Submit</button>
        </div>
        <img src={"/assets/output.jpg"} alt="" style={{ width: '40%' }} />
        <p>{this.state.textFromFile}</p>
        <audio src={"/assets/output.wav"} controls key={this.state.audioCount} />
        
        </div>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}

        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <img src={"/assets/violin.jpg"} alt="" style={{ width: '40%' }} />
          <p>"there is a man in a suit of armor walking through the woods"</p>
          <audio src={"/assets/violin.wav"} controls key={this.state.audioCount} />
          
          <img src={"/assets/horse_video.jpg"} alt="" style={{ width: '40%' }} />
          <p>"a woman riding on the back of a black horse"</p>
          <audio src={"/assets/horse_video.wav"} controls key={this.state.audioCount} />
          </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <img src={"/assets/guerra_medio.jpg"} alt="" style={{ width: '50%' }} />
          <p>"a group of men in medieval garb on horseback"</p>
          <audio src={"/assets/guerra_medio.wav"} controls key={this.state.audioCount} />

          <img src={"/assets/soldado_andando.jpg"} alt="" style={{ width: '50%' }} />
          <p>"two people walking down a path in the woods"</p>
          <audio src={"/assets/soldado_andando.wav"} controls key={this.state.audioCount} />
          </div>
        </div>
        
      </div>
    );
  }
}

export default TextInput;


