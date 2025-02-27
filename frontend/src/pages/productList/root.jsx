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
      fetch('http://localhost:8080/api/products', {
        method: 'GET', // 明确指定使用 GET 方法
        credentials: 'include' // 确保携带 cookie
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCardsData(data.data); // 假设返回的数据结构是 { data: [...] }
        setIsLoading(false);
      })
      .then(() => console.log(cardsData)) // 注意：这里的 console.log(cardsData) 可能不会按预期工作
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
              imageUrl={cardInfo.imageUrl[0]}
              className="m-2"
            />
          </NavLink>
        ))}
      </div>
    </>
  );
}