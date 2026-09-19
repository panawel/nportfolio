function elapsed(startDate: string) {
  const start = new Date(startDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (now.getDate() < start.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months };
}

export function ExperienceCounter({ startDate }: { startDate: string }) {
  const { years, months } = elapsed(startDate);

  return (
    <span>
      {years} yrs {months} mo
    </span>
  );
}
