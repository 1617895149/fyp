import { useEffect, useState } from "react";
import Card from "./card";
import { NavLink } from "react-router-dom";
import Bar from "./bar.jsx";

export default function Root() {
  const [cardsData, setCardsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const fetchData = () => {
      fetch('http://localhost:8080/api/products')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setCardsData(data.data);
          setIsLoading(false);
          
        }).then(()=>console.log(cardsData))
        .catch(error => {
          console.error('Error fetching data: ', error);
          setError('Failed to fetch data');
          setIsLoading(false);
        });
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Bar />
      <div className="flex flex-row flex-wrap justify-center">
        {cardsData.map((cardInfo) => (
          <NavLink key={cardInfo.id} to={`/product/${cardInfo.id}`}>
            <Card
              key={cardsData.indexOf(cardInfo)}
              title={cardInfo.name}
              price={cardInfo.price}
              imageUrl={cardInfo.imageUrl}
              className="m-2"
            />
          </NavLink>
        ))}
      </div>
    </>
  );
}