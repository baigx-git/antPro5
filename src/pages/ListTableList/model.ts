import {Effect, Reducer} from 'umi';
import {RecycleData} from './data.d';
import {getRegularTaskClean,settingBinClean} from './service';

export interface ModelType {
  namespace: string;
  state: RecycleData;
  effects: {
    getRegularTaskClean: Effect;
    settingBinClean: Effect;
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
  namespace: 'recycle',
  state: initState,
  effects: {
    * getRegularTaskClean({payload, callback}, {call}) {
      const response = yield call(getRegularTaskClean, payload);
      callback(response)
    },
    * settingBinClean({payload, callback}, {call}) {
      const response = yield call(settingBinClean, payload);
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
