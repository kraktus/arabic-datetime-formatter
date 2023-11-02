// include .css files
import './style.css';

window.onload = function () {
  const formatButton = document.getElementById('formatButton')!;
  formatButton.onclick = formatInputDate;
};

function createTableRow(data: [[string, string | undefined]]) {
  const row = document.createElement('tr');
  console.log('foo');
  console.log('data', data);
  data.forEach(([str, color]: [string, string | undefined]) => {
    console.log('each', [str, color]);
    const cell = document.createElement('td');
    cell.textContent = str;
    // set class to color
    if (color) {
      cell.className = color;
    }

    row.appendChild(cell);
  });

  return row;
}
const colors = [
  'lightred',
  'orange',
  'yellow',
  'lightgreen',
  'green',
  'darkgreen',
  'blue',
  'darkblue',
];

const colorMaker = () => {
  let colorIndex = 0;
  const getNextColor = () => {
    const c = colors[colorIndex];
    colorIndex += 1;
    return c;
  };

  const colorHM: Record<string, string> = {};
  const colorByDate = (formatted: string) => {
    // check if `formatted` is in hashmap
    if (colorHM[formatted] === undefined) {
      // if not, add it
      colorHM[formatted] = getNextColor();
    }
    return colorHM[formatted];
  };
  return colorByDate;
};

const customFormat = (options: Intl.DateTimeFormatOptions, date: Date) => {
  const newOptions: Intl.DateTimeFormatOptions = {
    ...options,
    calendar: 'gregory',
    numberingSystem: 'latn',
  };
  const formatted = Intl.DateTimeFormat('ar-sa', newOptions).format(date);
  console.log('formatted', formatted);
  return formatted;
};

const getColumnHeaders = (headerList: [string]) => {
  const row = document.createElement('tr');
  for (const header of headerList) {
    const cell = document.createElement('th');
    cell.textContent = header;
    row.appendChild(cell);
  }
  return row;
};

function getDateTimes(dateTime: Date) {
  const result = [];

  // Add the original date time to the result list
  result.push(dateTime);

  // Loop 12 times to add the subsequent date times
  for (let i = 1; i < 12; i++) {
    // Get the current month and year
    const currentMonth = dateTime.getMonth();
    const currentYear = dateTime.getFullYear();

    // Calculate the next month and year
    const nextMonth = (currentMonth + i) % 12;
    const nextYear = currentYear + Math.floor((currentMonth + i) / 12);

    // Create the new date time
    const nextDateTime = new Date(
      nextYear,
      nextMonth,
      dateTime.getDate(),
      dateTime.getHours(),
      dateTime.getMinutes(),
      dateTime.getSeconds()
    );

    // Add it to the result list
    result.push(nextDateTime);
  }

  return result;
}

function formatInputDate() {
  const dateEl = document.getElementById('dateTimeInput')! as HTMLInputElement;
  const dateInput = dateEl.value;
  const outputElement = document.getElementById('output')!;

  outputElement.innerHTML = '';

  if (dateInput !== '') {
    // retrieve values from year/month/day/time checkboxes
    const yearEl = document.getElementById('year')! as HTMLInputElement;
    const monthEl = document.getElementById('month')! as HTMLInputElement;
    const dayEl = document.getElementById('day')! as HTMLInputElement;
    const timeEl = document.getElementById('time')! as HTMLInputElement;
    const options: Intl.DateTimeFormatOptions = {
      year: yearEl.checked ? 'numeric' : undefined,
      month: monthEl.checked ? 'short' : undefined,
      day: dayEl.checked ? 'numeric' : undefined,
      hour: timeEl.checked ? 'numeric' : undefined,
      minute: timeEl.checked ? 'numeric' : undefined,
    };
    const _locales = [
      'en',
      'ar',
      'ar-AE',
      'ar-BH',
      'ar-DJ',
      'ar-DZ',
      'ar-EG',
      'ar-EH',
      'ar-ER',
      'ar-IL',
      'ar-IQ',
      'ar-IQ',
      'ar-JO',
      'ar-JO',
      'ar-KM',
      'ar-KW',
      'ar-LB',
      'ar-LY',
      'ar-MA',
      'ar-MR',
      'ar-OM',
      'ar-PS',
      'ar-QA',
      'ar-SA',
      'ar-SD',
      'ar-SO',
      'ar-SS',
      'ar-SY',
      'ar-TD',
      'ar-TN',
      'ar-YE',
    ];
    console.log(_locales);
    // @ts-ignore Idk why despite ES2020 it's not recognized
    const canonicals = Intl.getCanonicalLocales(_locales);
    console.log(canonicals);
    const datetimes = getDateTimes(new Date(dateInput));
    console.log(datetimes.length);
    // create headers canonicals + custom
    const headersLabel = canonicals.concat(['custom']);
    const headers = getColumnHeaders(headersLabel);
    const rows = datetimes.map(datetime => {
      const colorByDate = colorMaker();

      let formatteds: [[string, string | undefined]] = canonicals.map(
        (locale: string) => {
          const formatted = Intl.DateTimeFormat(locale, options).format(
            datetime
          );
          const color = locale == 'en' ? undefined : colorByDate(formatted);
          return [formatted, color];
        }
      );
      // add custom format
      const custom = customFormat(options, datetime);
      formatteds.push([custom, colorByDate(custom)]);
      return createTableRow(formatteds);
    });
    // use headers and rows to create a table and attach it to output
    const table = document.createElement('table');
    table.appendChild(headers);
    rows.forEach(row => table.appendChild(row));
    outputElement.appendChild(table);
  }
}
