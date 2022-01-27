import { useEffect, useState } from "react";

import './style.css'

export default function Content(){
    //Declaración de constantes
    const [firstData, setFirstData] = useState(null);
    const [pokemonsInfo, setPokemonsInfo] = useState(null);
    const urlOne = 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=10';

     //Ejecución para consumir la API
    const fetchApi = async(url) =>{
        try {
            const response = await fetch(url);
            const responseJson = await response.json();
            /**voy a hacer el fetch de las url que están en el vector result
              * Array de promises*/
            const promises = responseJson.results.map((element) => fetch(element.url));
             //Promise.all retorna una promesa
            const responsesPokemons = await Promise.all(promises);
            //itero por cada una de las respuestas y devuelvo un array de promesas nuevamente
            const responsesPokemonsPromises = responsesPokemons.map((element) => element.json());
            const responsesPokemonsJson = await Promise.all(responsesPokemonsPromises);
            setFirstData(responseJson); 
            setPokemonsInfo(responsesPokemonsJson);
        } catch (error) {
            console.error('Error en el consumo de la API' + error);
        }
    };
    useEffect(() => {
        fetchApi(urlOne);
    },[]);
    //método para mostrar todo el contenido
    const renderizar = () =>{    
        const pokemons = pokemonsInfo.filter(element => element.id <= 151);
        return pokemons?.map((element) => {
                return(
                    <div className="card_rotate" key={element.id}>
                        <div className="card_pokemon">
                            <div className="card_front">
                                <div className="content_img">
                                <img src= {`${element.sprites.other.dream_world.front_default}`} alt={`Imagen pokemón`} />
                                </div>
                                <div className="name_number_pokemon">
                                    <b><p>{`Nombre: ${element.name}`}</p></b>
                                    <b><p>{`Número: ${element.id}`}</p></b>
                                </div>
                            </div>
                            <div className="card_back">
                                <h4>Información</h4>
                                <p>{`Talla: ${element.height}`}</p>
                                <p>{`Peso: ${element.weight}`}</p>
                                <p>{`Especie: ${element.species.name}`}</p>
                                <p>{`Experiencia: ${element.base_experience}`}</p>
                            </div>
                        </div>
                    </div>
                );
        }) 
    };   
    return(
        <>
            <header>
                <img className="img_title" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/2560px-International_Pok%C3%A9mon_logo.svg.png" alt="logo pokemon"/>
            </header>
            <section className="cards">   
                {  
                    pokemonsInfo ? renderizar() : <h2>Loading...</h2>   
                }                       
            </section>
            <div className="buttons">
                <button className="button_back" disabled={firstData? firstData.previous === null:true} 
                onClick={()=>{firstData && fetchApi(firstData.previous)}}>
                    <b> Atrás</b>
                </button>
                <button className="button_next" disabled= {pokemonsInfo? pokemonsInfo.filter(element=> element.id > 151).length !== 0 :null} 
                onClick={()=>{firstData && fetchApi(firstData.next)}}>
                    <b>Siguiente</b>
                </button>
            </div>
        </>
    );
}