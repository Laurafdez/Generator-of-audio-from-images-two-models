import React, { Component } from "react";
import TextInput from "./TextInput";

class App extends Component {
  handleSubmit = (inputText) => {
    console.log(inputText);
    // Aquí puedes llamar a una función que maneje la entrada del usuario
  };

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>Generator of audio</h1>
        <TextInput onSubmit={this.handleSubmit} />
      </div>
    );
  }
}

export default App;
