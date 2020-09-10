import { Effect, Reducer } from 'umi';
import { TaskData } from './data.d';
import { getBusiness, createTaskController} from './service';

export interface ModelType {
  namespace: string;
  state: TaskData;
  effects: {
    fetchBusinessType: Effect;
    createTask:Effect;
  };
  reducers: {
    save: Reducer<TaskData>;
  };
}

const initState = {
  business: [],
};

const Model: ModelType = {
  namespace: 'task',
  state: initState,

  effects: {
    *fetchBusinessType(_, { call, put }) {
      const response = yield call(getBusiness);
      yield put({
        type: 'save',
        payload: {
          business: response.result,
        },
      });
    },
    *createTask({payload,callback},{ call}){
      const response = yield call(createTaskController,payload);
      callback(response)
    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    }
  },
};

export default Model;
