export async function GET() {
  const res = await fetch('https://glb2.warriorgeneral.com/game/json/skills');
  if (!res.ok) throw Error('Error fetching skills json');
  const resText = await res.text();
  const skills = JSON.parse(resText.substring(resText.indexOf('skills: ') + 8, resText.indexOf('}}},') + 3));
  return Response.json(skills);
}
