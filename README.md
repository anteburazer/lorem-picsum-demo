# Lorem Picsum

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Install dependencies
### `yarn`

## Start the project

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


## Description
The project is bootstrapped with [react-project-architecture](https://github.com/anteburazer/react-project-architecture) template so there is some unused code inherited from the template and most of the code is under the [src/apps/images](https://github.com/anteburazer/lorem-picsum-demo/tree/master/src/apps/images) folder.

The project is using [xstate](https://xstate.js.org/) state machines for state management. There are two child state machine for list and edit page and one global for the data which need to outlive the page components.

Search works only with currently displayed images. When going through pagination we are fetching the images from the API and not persisting anytihng locally.

If user edits the image, the change will be stored in the local storage. When refershing the page the last change will be visible. If user edits another image the local storage will be overriden by the latest change.
