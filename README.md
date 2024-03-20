# react-use-pitch-recognition

`react-use-pitch-recognition` is a React hook library designed to simplify the integration of pitch detection functionality into your React applications. Utilizing the user's microphone, it listens to audio input in real-time and provides the detected pitch's frequency and corresponding musical note.

This library is ideal for creating music visualization tools, tuning applications, or any project requiring pitch detection capabilities.

## Features

- Real-time pitch detection from audio input.
- Outputs both the frequency and the musical note of the detected pitch.
- Easy integration into React projects.

## Installation

Install `react-use-pitch-recognition` using npm:

```bash
npm install react-use-pitch-recognition
```

Or using yarn:

```bash
yarn add react-use-pitch-recognition
```

## Usage

Here's a quick example to get you started:

```jsx
import React from 'react';
import { usePitchRecognition } from 'react-use-pitch-recognition';
import BallVisualizer from './components/BallVisualizer'; // Your visualization component

function App() {
  const pitch = usePitchRecognition();

  return (
    <div className="two-column">
      <div>
        <div className="data">
          <div>Frequency (Hz): {pitch.frequency}</div>
          <div>Note: {pitch.note}</div>
        </div>
      </div>
      <BallVisualizer frequency={pitch.frequency} />
    </div>
  );
}

export default App;
```

### `usePitchRecognition` Hook
The `usePitchRecognition` hook listens to the microphone's audio input and provides an object with two properties:

* `frequency`: The detected pitch frequency in Hertz (Hz).
* `note`: The musical note corresponding to the detected frequency.

## Contributing

Contributions are always welcome! Please read the contributing guidelines first.

## License

Distributed under the MIT License. See LICENSE for more information.