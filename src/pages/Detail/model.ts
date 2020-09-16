import {Effect, Reducer} from 'umi';
import {RecycleData} from './data.d';
import {getRegularTaskClean,settingBinClean,queryTask} from './service';

export interface ModelType {
  namespace: string;
  state: RecycleData;
  effects: {
    getRegularTaskClean: Effect;
    settingBinClean: Effect;
    queryTask: Effect;
  };
  reducers: {
    save: Reducer<RecycleData>;
  };
}

const initState = {
  recycle:{
    id: "",
    cycleDay:30
  }
};

const Model: ModelType = {
  namespace: 'detail',
  state: initState,
  effects: {
    * getRegularTaskClean({payload, callback}, {call}) {
      const response = yield call(getRegularTaskClean, payload);
      callback(response)
    },
    * settingBinClean({payload, callback}, {call}) {
      const response = yield call(settingBinClean, payload);
      callback(response)
    },
    * queryTask({payload, callback}, {call}){
      const response = yield call(queryTask, payload);
      callback(response)
    }
  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    }
  },
};

export default Model;
