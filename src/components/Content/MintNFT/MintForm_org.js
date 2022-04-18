import { useState, useContext } from 'react';

import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';

const ipfsClient = require('ipfs-http-client');
const ipfs = new ipfsClient.create({ host: '127.0.0.1', port: '5001', protocol: 'http'});

// const ipfs = ipfsClient.create({ host: 'localhost', port: 5001, protocol: 'http' });
// const ipfs = ipfsClient.create('/ip4/127.0.0.1/tcp/5001');

const MintForm = () => {
  const [enteredName, setEnteredName] = useState('');
  const [descriptionIsValid, setDescriptionIsValid] = useState(true);

  const [enteredDescription, setEnteredDescription] = useState('');
  const [nameIsValid, setNameIsValid] = useState(true);

  const [capturedFileBuffer, setCapturedFileBuffer] = useState(null);
  const [fileIsValid, setFileIsValid] = useState(true);

  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);

  const enteredNameHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const enteredDescriptionHandler = (event) => {
    setEnteredDescription(event.target.value);
  };

  const captureFile = (event) => {
    event.preventDefault();

    const file = event.target.files[0];

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setCapturedFileBuffer(Buffer(reader.result));
    }
  };

  // Upload file to IPFS and push to the blockchain
  const mintNFT = async() => {
    console.log('ipfs success #0');
    // Add file to the IPFS
    // const fileAdded = await ipfs.add(capturedFileBuffer);
    const fileAdded = await ipfs.add(capturedFileBuffer, {
      pin: false,
      wrapWithDirectory: false
    })
    if(!fileAdded) {
      console.error('Something went wrong when updloading the file');
      return;
    }
    console.log('ipfs success #1');

    const metadata = {
      title: "Asset Metadata",
      type: "object",
      properties: {
        name: {
          type: "string",
          description: enteredName
        },
        description: {
          type: "string",
          description: enteredDescription
        },
        image: {
          type: "string",
          description: fileAdded.path
        }
      }
    };

    // const metadataAdded = await ipfs.add(JSON.stringify(metadata));
    const metadataAdded = await ipfs.add(JSON.stringify(metadata), {
      pin: false,
      wrapWithDirectory: false
    })
    if(!metadataAdded) {
      console.error('Something went wrong when updloading the file');
      return;
    }
    console.log('ipfs success #2');

    const collectionAdded = await collectionCtx.contract.methods.safeMint(metadataAdded.path).send({ from: web3Ctx.account })
        .on('transactionHash', (hash) => {
          collectionCtx.setNftIsLoading(true);
        })
        .on('error', (e) =>{
          window.alert('Something went wrong when pushing to the blockchain');
          collectionCtx.setNftIsLoading(false);
        })
    console.log('safeMint contract success #3 ');
    // console.log('safeMint contract success #3 : %s', JSON.stringify(collectionAdded));
  };


  const submissionHandler = (event) => {
    event.preventDefault();

    enteredName ? setNameIsValid(true) : setNameIsValid(false);
    enteredDescription ? setDescriptionIsValid(true) : setDescriptionIsValid(false);
    capturedFileBuffer ? setFileIsValid(true) : setFileIsValid(false);

    const formIsValid = enteredName && enteredDescription && capturedFileBuffer;


    formIsValid && mintNFT();
  };

  const nameClass = nameIsValid? "form-control" : "form-control is-invalid";
  const descriptionClass = descriptionIsValid? "form-control" : "form-control is-invalid";
  const fileClass = fileIsValid? "form-control" : "form-control is-invalid";

  return(
      <form onSubmit={submissionHandler} method="post" enctype="multipart/form-data">
        <div className="row justify-content-center">
          <div className="col-md-2">
            <input
                type='text'
                className={`${nameClass} mb-1`}
                placeholder='Name...'
                value={enteredName}
                onChange={enteredNameHandler}
            />
          </div>
          <div className="col-md-6">
            <input
                type='text'
                className={`${descriptionClass} mb-1`}
                placeholder='Description...'
                value={enteredDescription}
                onChange={enteredDescriptionHandler}
            />
          </div>
          <div className="col-md-2">
            <input
                type='file'
                className={`${fileClass} mb-1`}
                onChange={captureFile}
            />
          </div>
        </div>
        <button type='submit' className='btn btn-lg btn-info text-white btn-block'>MINT</button>
      </form>
  );
};

export default MintForm;