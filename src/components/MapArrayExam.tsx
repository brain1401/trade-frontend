export default function MapArrayExam() {
  const numbers = [1, 2, 3, 4, 5];

  return (
    <>
      <div>
        {numbers.map((item, index) => (
          <div key={index}>
            {index}번째 요소 : {item}
          </div>
        ))}
      </div>
    </>
  );
}
