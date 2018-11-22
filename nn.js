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
        let rate = 0.1;

        for (let i = 0; i < this.hiddenNodes; i++) {
            for (let j = 0; j <  this.inputNodes; j++){
                if (Math.random() < rate){
                    this.weights_ih.data[i][j] = nn.weights_ih.data[i][j];
                }
            }
        }

        for (let i = 0; i < this.outputNodes; i++) {
            for (let j = 0; j <  this.hiddenNodes; j++){
                if (Math.random() < rate){
                    this.weights_ho.data[i][j] = nn.weights_ho.data[i][j];
                }
            }
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
            val += randomGaussian(0, 0.05);
            if (val > 1) val = 1;
            if (val < -1) val = -1;
          } 

          return val;
        }

        this.weights_ih.map(mutate);
        this.weights_ho.map(mutate);
        this.bias_h.map(mutate);
        this.bias_o.map(mutate);
    }

}