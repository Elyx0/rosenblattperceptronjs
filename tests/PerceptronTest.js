import Perceptron from '../src/Perceptron';
import test from 'tape';

test('Activate', t => {
  t.plan(3);
  const p = new Perceptron();
  t.equals(p.activate(-1),0,'Negative value classify to 0');
  t.equals(p.activate(0),1,'0 value classify to 1');
  t.equals(p.activate(1),1,'Positive value classify to 1');
});

test('Delta', t => {
  t.plan(1);
  const p = new Perceptron();
  const actual = p.delta(0,1,1,0.1);
  const expected = (1-0) * 1 * .1;
  t.equals(actual,expected,'Delta are calculated');
});

test('WeightedSum', t => {
  t.plan(4);
  const p = new Perceptron();
  let actual = p.weightedSum([1,1,1,1],[0,0,1,1]);
  let expected = 2;
  t.equals(actual,expected,'Sum check1 ok');
  actual = p.weightedSum([0,0,0,0],[1,1,1,1]);
  expected = 0;
  t.equals(actual,expected,'Sum check2 ok');
  actual = p.weightedSum([1,1,1,1],[0,0,0,0]);
  expected = 0;
  t.equals(actual,expected,'Sum check3 ok');
  actual = p.weightedSum([0,0,1,1],[0,0,0,0]);
  expected = 0;
  t.equals(actual,0,'Sum check4 ok');
});

test('Training with fast learning rate', t => {
  t.plan(11);
  const p = new Perceptron(1,1,[0,0,0,0]);
  t.deepEqual(p.weights,[0,0,0,0],'Weight init ok');
  let actual = p.train([1,1,1],1);

  t.equals(p.trainingSet.length,1,'Training set got added');
  t.equals(actual,true,'Weight did not change');
  actual = p.train([1,1,1],1);
  t.equals(p.trainingSet.length,1,'Same training set did not get re-added');
  t.equals(actual,true,'Weight did not change on retrain same input');
  t.equals(p.evaluate([1,1,1]),1,'Evaluates correctly');

  // Adding other training set
  let oldWeights = p.weights.slice();
  actual = p.train([0,0,1],0);
  t.equals(p.trainingSet.length,2,'Training set got added');
  t.equals(actual instanceof Array,true,'New weights are instance of Array');
  t.notDeepEqual(actual,oldWeights,'New weights are different');

  oldWeights = p.weights.slice();
  actual = p.train([1,0,1],1);
  t.equals(actual instanceof Array,true,'New weights are instance of Array');
  t.notDeepEqual(actual,oldWeights,'New weights are different');
});

test('Learns AND', t=> {
  t.plan(6);
  const p = new Perceptron();
  p.train([1,1],1);
  p.train([1,0],0);
  p.train([0,1],0);

  t.equals(p.trainingSet.length,3,'Learning set should be 3');

  let spyCalls = -1;
  const spy = function() {
    spyCalls++;
  }
  p.learn(spy);
  console.log(`Found weights: [${p.weights}]`);
  // Confirming all training set are valid
  t.equals(p.predict([1,1]),1,'Predicts 1 && 1 -> 1 correctly');
  t.equals(p.predict([0,1]),0,'Predicts 0 && 1 -> 0 correctly');
  t.equals(p.predict([1,0]),0,'Predicts 1 && 0 -> 1 correctly');

  // Never seen case
  t.equals(p.predict([0,0]),0,'Predicts never seen value 0 && 0 -> 0 correctly');

  t.equals(spyCalls < 50,true,'Setting the weights should have taken less than 50 iterations');
});
