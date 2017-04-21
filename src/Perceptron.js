class Perceptron {
  constructor(bias=1,learningRate=0.1,weights=[]) {
    this.bias = bias;
    this.learningRate = learningRate;
    this.weights = weights;
    this.trainingSet = [];
  }

  init(inputs,bias=this.bias) {
    // Initialize weights to 0 and adding bias weight
    this.weights = [...inputs.map(i => Math.random()), bias];
  }

  train(inputs,expected) {
    if (!this.weights.length) this.init(inputs);
    if (inputs.length != this.weights.length) inputs.push(1); // Adding the bias

    // Keeping this in the training set if it didn't exist
    if (!this.trainingSet.find(t => t.inputs.every((inp,i) => inp === inputs[i]))) this.trainingSet.push({inputs,expected});

    const actual = this.evaluate(inputs);
    if (actual == expected) return true; // Correct weights return and don't touch anything.

    // Otherwise update each weight by adding the error * learningRate relative to the input
    this.weights = this.weights.map((w,i) => w += this.delta(actual, expected,inputs[i]));
    return this.weights;
  }

  // Calculates the difference between actual and expected for a given input
  delta(actual, expected, input,learningRate=this.learningRate) {
    const error = expected - actual; // How far off were we
    return error * learningRate * input;
  }

  // Iterates until the weights are correctly set
  learn(iterationCallback=()=>{},trainingSet=this.trainingSet) {
    let success = false;
    while (!success) {
      // Function of your choosing that will be called after an iteration has completed
      iterationCallback.call(this);
      success = trainingSet.every(t => this.train(t.inputs,t.expected) === true);
    }
  }
  // Sum inputs * weights
  weightedSum(inputs=this.inputs,weights=this.weights) {
    return inputs.map((inp,i) => inp * weights[i]).reduce((x,y) => x+y,0);
  }

  // Evaluate using the current weights
  evaluate(inputs) {
    return this.activate(this.weightedSum(inputs));
  }

  // Sugar syntax evaluate with added bias input
  predict(inputs) {
    return this.evaluate([...inputs,1]);
  }

  // Heaviside as the activation function
  activate(value) {
    return value >= 0 ? 1 : 0;
  }

}

export default Perceptron;
