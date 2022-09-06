import React, { useEffect, useState, useContext}from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';



const UpdatePlace = () => {
    const {isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedPlace, setLoadedPlace ] = useState();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const placeId = useParams().placeId;


    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: loadedPlace ?  loadedPlace.title  : '',
            isValid: false
        }, 
        description: {
            value: loadedPlace ?  loadedPlace.description  : '',
            isValid: false
        }
    }, true);


    useEffect(()=> {
        const fetchPlace= async () => {
            try {             
              const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
              setLoadedPlace(responseData.place);
              setFormData({
                title: {
                    value: responseData.title,
                    isValid: true
                }, 
                description: {
                    value: responseData.description,
                    isValid: true
                }
            }, true);
            } catch(err) {}            
        }
        fetchPlace();
    }, [sendRequest, placeId, setFormData]);
   

    const updatePlaceSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            console.log('place id: ' + placeId);
            await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, 'PATCH', JSON.stringify({
                title: formState.inputs.title.value,
                description: formState.inputs.description.value
            }), {'Content-Type': 'application/json', Authorization: 'Bearer ' + auth.token});

          navigate(`/${auth.userId}/places`);
        } catch(err) {}       
    };

    if(isLoading) {
        return (<div className="center">
        <LoadingSpinner />
    </div>)
    }


    if(!loadedPlace && !error) {
        return (<div className="center">
            <Card>Could not find place!</Card>
        </div>)
    }


    return (
    <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
       {!isLoading && loadedPlace && <form className="place-form" onSubmit={updatePlaceSubmitHandler}>
        <Input 
            id="title" 
            element="input" 
            type ="text" 
            label="Title" 
            validators={[VALIDATOR_REQUIRE()]} 
            errorText= "Please enter a valid title." 
            onInput={inputHandler}  
            initialValue={loadedPlace.title}
            initialValid={true}
        />
         <Input 
            id="description" 
            element="textarea" 
            label="Description" 
            validators={[VALIDATOR_MINLENGTH(5)]} 
            errorText= "Please enter a valid description (min 5 characters)." 
            onInput={inputHandler}  
            initialValue={loadedPlace.description}
            initialValid={true}
        />

        <Button type="submit" disabled={!formState.isValid}>UPDATE PLACE</Button>
        </form>}
    </React.Fragment>
   )
};

export default UpdatePlace;