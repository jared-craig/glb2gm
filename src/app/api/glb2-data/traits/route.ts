export async function GET() {
  const res = await fetch('https://glb2.warriorgeneral.com/game/json/traits');
  if (!res.ok) throw Error('Error fetching traits json');
  const resText = await res.text();
  const traits = JSON.parse(resText.substring(resText.indexOf('var definitions = ') + 18, resText.indexOf('}};') + 2));
  return Response.json(traits);
}
