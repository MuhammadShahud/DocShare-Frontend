import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Reducer } from './Reducers'

const store = createStore(Reducer, applyMiddleware(thunk));

store.subscribe(async () => {
    // console.log('STATE=>', store.getState());
});
export { store };