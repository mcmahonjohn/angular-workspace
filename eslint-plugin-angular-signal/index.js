import { requireInputSignalType } from './lib/rules/require-inputsignal-type.js';

export default {
    configs: {
        recommended: {
            'angular-signal/require-inputsignal-type': 'error',
        },
    },
    plugin: {
      rules: {
        'require-inputsignal-type': requireInputSignalType,
      },
  },
};
