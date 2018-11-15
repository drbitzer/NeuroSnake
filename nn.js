function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function relu(x) {
    return Math.max([0, x]);
}

function tanh(x) {
    return Math.tanh(x);
}

class NeuralNetwork {

    constructor(inputNodes, hiddenNodes, outputNodes) {  
        
        if (inputNodes instanceof NeuralNetwork) {
            this.inputNodes = inputNodes.inputNodes;
            this.hiddenNodes = inputNodes.hiddenNodes;
            this.outputNodes = inputNodes.outputNodes;

            this.weights_ih = inputNodes.weights_ih.copy();
            this.weights_ho = inputNodes.weights_ho.copy();

            this.bias_h = inputNodes.bias_h.copy();
            this.bias_o = inputNodes.bias_o.copy();
        } else if(inputNodes) {
            this.inputNodes = inputNodes;
            this.hiddenNodes = hiddenNodes;
            this.outputNodes = outputNodes;

            this.weights_ih = new Matrix(this.hiddenNodes, this.inputNodes);
            this.weights_ho = new Matrix(this.outputNodes, this.hiddenNodes);
            this.weights_ih.randomize();
            this.weights_ho.randomize();

            this.bias_h = new Matrix(this.hiddenNodes, 1);
            this.bias_o = new Matrix(this.outputNodes, 1);
            this.bias_h.randomize();
            this.bias_o.randomize();
        }
    }

    copy(){
        return new NeuralNetwork(this);
    }

    combine(nn){
        let hidden = this.hiddenNodes / 2;
        let output = this.outputNodes / 2;

        let extern = 0;
        for (let i = 0; i < hidden; i++) {
            extern = Math.random() * this.hiddenNodes;
            this.weights_ih.data[extern] = nn.weights_ih.data[extern];
        }

        for (let i = 0; i < output; i++) {
            extern = Math.random() * this.outputNodes;
            this.weights_ho.data[extern] = nn.weights_ho.data[extern];
        }        
    }

    feedForward(input_array) {

        //Generate the hidden output
        let input = Matrix.fromArray(input_array);
        let hidden = Matrix.multiply(this.weights_ih, input);
        hidden.add(this.bias_h);

        //Activation funciton
        hidden.map(sigmoid);

        //Generate the output
        let output = Matrix.multiply(this.weights_ho, hidden);
        output.add(this.bias_o);
        output.map(sigmoid);

        return output.toArray();
    }

    mutate(rate) {
        function mutate(val) {
          if (Math.random() < rate) {
            // return 2 * Math.random() - 1;
            return val + randomGaussian(0, 0.1);
          } else {
            return val;
          }
        }
        this.weights_ih.map(mutate);
        this.weights_ho.map(mutate);
        this.bias_h.map(mutate);
        this.bias_o.map(mutate);
    }

}