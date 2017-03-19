import {SAMPLE} from './action';

const initialState = {
  header: [],
  footer: [],
  rows: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SAMPLE: {
      return state;
    }

    default: {
      return state;
    }

  }
};
