import React from 'react';
import init from './init.js';
import commandsModule from './commandsModule.js';
// import CornerstoneViewportDownloadForm from './CornerstoneViewportDownloadForm';

const Component = React.lazy(() => {
  return import(/* webpackPrefetch: true */ './OHIFCornerstoneViewport');
});

const OHIFCornerstoneViewport = props => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Component {...props} />
    </React.Suspense>
  );
};

// TODO -> Inject these using webpack from package.json
const id = '@ohif/extension-cornerstone';
const version = '3.0.0';

/**
 *
 */
export default {
  /**
   * Only two required properties. Should be a unique value across all extensions.
   */
  id,
  version,

  /**
   *
   *
   * @param {object} [configuration={}]
   * @param {object|array} [configuration.csToolsConfig] - Passed directly to `initCornerstoneTools`
   */
  preRegistration({ servicesManager, commandsManager, configuration = {} }) {
    init({ servicesManager, commandsManager, configuration });
  },
  getViewportModule({ servicesManager, commandsManager }) {
    const ExtendedOHIFCornerstoneViewport = props => {
      const onNewImageHandler = jumpData => {
        commandsManager.runCommand('jumpToImage', jumpData);
      };
      const { ToolBarService } = servicesManager.services;

      return (
        <OHIFCornerstoneViewport
          {...props}
          ToolBarService={ToolBarService}
          servicesManager={servicesManager}
          commandsManager={commandsManager}
          onNewImage={onNewImageHandler}
        />
      );
    };

    return [
      { name: 'cornerstone', component: ExtendedOHIFCornerstoneViewport },
    ];
  },
  getCommandsModule({ servicesManager, commandsManager }) {
    return commandsModule({ servicesManager, commandsManager });
  },
};
