
import * as tf from '@tensorflow/tfjs';

// Configure TensorFlow.js to use the WebGL backend
export async function initializeTensorFlow(): Promise<void> {
  try {
    // Set the backend to WebGL for faster processing
    await tf.setBackend('webgl');
    
    // Warm up the model
    const dummyTensor = tf.zeros([1, 1, 1, 3]);
    dummyTensor.dispose();
    
    console.log('TensorFlow.js initialized successfully with backend:', tf.getBackend());
    console.log('WebGL max texture size:', tf.env().getNumber('WEBGL_MAX_TEXTURE_SIZE'));
    console.log('WebGL version:', tf.env().getNumber('WEBGL_VERSION'));
    
    return Promise.resolve();
  } catch (error) {
    console.error('Failed to initialize TensorFlow.js:', error);
    
    // Try to fallback to CPU
    try {
      await tf.setBackend('cpu');
      console.log('Fallback to CPU backend');
      return Promise.resolve();
    } catch (cpuError) {
      return Promise.reject('Failed to initialize TensorFlow.js: ' + error);
    }
  }
}

// Helper to check memory usage (useful for debugging memory leaks)
export function checkMemoryUsage(): void {
  if (tf.engine() && tf.memory) {
    const memoryInfo = tf.memory();
    console.log('Memory usage:', {
      numTensors: memoryInfo.numTensors,
      numDataBuffers: memoryInfo.numDataBuffers,
      unreliable: memoryInfo.unreliable,
      reasons: memoryInfo.unreliable ? memoryInfo.reasons : 'N/A'
    });
  }
}

// Clean up TensorFlow resources
export function disposeTensorflow(): void {
  try {
    tf.disposeVariables();
    console.log('TensorFlow.js resources disposed');
  } catch (error) {
    console.error('Error disposing TensorFlow.js resources:', error);
  }
}
