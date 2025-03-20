import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { Input } from './ui/input';
import { TableBody } from './ui/table';

const OrderConfirmation: React.FC = () => {
  const seamlessInputClass = 'h-4 text-[4px] border-none bg-transparent p-0 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-normal';

  // State to hold order data
  const [orderData, setOrderData] = useState({
    belegNr: '',
    datum: '',
    seite: '1',
    kundenNr: '',
    kunde: 'Home24',
    uidGeschäftspartner: '',
    bestätigungsKW: '',
    d: '',
    wunschKW: '',
    referenz: '',
    aufArt: 'Standard',
    aesVerband: '',
    ihrAnsprechpartnerName: '',
    ihrAnsprechpartnerEmail: '',
    lieferadresse: [],
    artikelNr: '',
    bezeichnung: '',
    menge: '',
    preis: '',
    mwst: '19%',
    gesbEuro: '',
    totalColli: '',
  });

  // State for input values
  const [menge, setMenge] = useState(2);
  const [preis, setPreis] = useState(12.23);
  const [mwst, setMwst] = useState(19);

  // Helper function to get the ISO week number of a given date
  const getWeekNumber = (date: Date) => {
    const startDate = new Date(date.getFullYear(), 0, 1); // Start of the year
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)); // Days since the start of the year
    const weekNumber = Math.ceil((days + 1) / 7); // Week number
    return weekNumber;
  };

  // Helper function to add weeks to a date
  const addWeeks = (date: Date, weeks: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + weeks * 7); // Add weeks
    return newDate;
  };

  useEffect(() => {
    fetch('https://localhost:7232/api/Orders/81748')
      .then(response => response.json())
      .then(data => {
        console.log('Full API Response:', data); // ✅ Check full response
        if (Array.isArray(data) && data.length > 0) {
          // Format the OrderDate for Datum
          const orderDate = new Date(data[0].OrderDate);
          const formattedDatum = orderDate.toLocaleDateString('de-DE'); // Converts to 'dd.MM.yyyy'

          // Get the week number for the OrderDate and then add 4 weeks
          const currentWeek = getWeekNumber(orderDate);
          const updatedDate = addWeeks(orderDate, 4);
          const updatedWeek = getWeekNumber(updatedDate);

          // Get the year from the updated date
          const updatedYear = updatedDate.getFullYear();

          // Format Bestätigungs-KW as '14. KW 2025'
          const formattedBestätigungsKW = `${updatedWeek}. KW ${updatedYear}`;

          // Split Address2 by line breaks and set it as an array
          const lieferadresse = data[0].Address2 ? data[0].Address2.split('\r') : [];

          setOrderData(prevData => ({
            ...prevData,
            belegNr: data[0].OrderNumber || 'No Data', // Set MaxDocNum as Beleg Nr.
            datum: formattedDatum, // Set formatted OrderDate as Datum
            kundenNr: data[0].CustomerCode || 'No Data', // Set CustomerCode as Kunden Nr.
            uidGeschäftspartner: data[0].LicTradNum || 'No Data', // Set LicTradNum as UID-Geschäftspartner
            bestätigungsKW: formattedBestätigungsKW, // Set formatted Bestätigungs-KW
            referenz: data[0].NumAtCard || 'No Data', // Set NumAtCard as Referenz
            lieferadresse: lieferadresse, // Set Address2 as Lieferadresse (split by line breaks)
            kundeN:  data[0].CustomerName,
          }));
        } else {
          console.error('Unexpected API response:', data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Calculate totals
  const totalPreis = menge * preis;
  const mwstBetrag = (totalPreis * mwst) / 100;
  const gesamt = totalPreis + mwstBetrag;

  return (
    <div className="print-container mx-auto bg-white p-6 border border-gray-300 shadow-sm">
      <div className="flex justify-between mb-8">
        <div className="w-1/2">
        <img
    src="/public\ForestdreamLOGO.jpg" // Replace with your logo's actual path
    alt="Forestdream Logo"
    style={{ width: 'auto', height: '35px' }} // Adjust the size as needed
  />
          <div className="text-[10px] mt-6">
            <p>Forestdream Möbelagentur GmbH & Co. KG, Weddigenuter 2, 32052 Herford</p>
          </div>
          <div className="mt-2 text-[10px]">
            <p className="font-bold">BDSK Handels GmbH & Co. KG</p>
            <p>Margentheiner Str. 59</p>
            <p className="mt-3">97084 Würzburg GERMANY</p>
          </div>
        </div>

        <div className="w-1/2">
          <table className="w-full table-bordered border-collapse text-[7px]">
            <thead>
              <tr>
                <th colSpan={3} className="forestdream-header text-[9px]">
                  Kundendienst Auftragsbestätigung
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }} className="w-1/3">Beleg Nr.</td>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }} className="w-1/3">Datum</td>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }}  className="w-1/3" >Seite</td>
              </tr>
              <tr>
                <td>
                  <Input
                    className={seamlessInputClass}
                    style={{ fontSize: '10px' }}
                    value={orderData.belegNr || ''} // ✅ Ensures it's never undefined
                    readOnly
                  />
                </td>
                <td>
                  <Input className={seamlessInputClass} style={{ fontSize: '10px' }} value={orderData.datum} />
                </td>
                <td>
                  <Input className={seamlessInputClass} style={{ fontSize: '10px' }} value={orderData.seite} />
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }}>Kunden Nr.</td>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }}>Kunde</td>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }}>UID-Geschäftspartner</td>
              </tr>
              <tr>
                <td>
                  <Input className={seamlessInputClass} style={{ fontSize: '10px' }} value={orderData.kundenNr} />
                </td>
                <td>
                  <Input className={seamlessInputClass} style={{ fontSize: '10px' }} value={orderData.kundeN} />
                </td>
                <td>
                  <Input className={seamlessInputClass} style={{ fontSize: '10px' }} value={orderData.uidGeschäftspartner} />
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }}>Bestätigungs-KW</td>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }} className="text-center">D</td>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }}>Wunsch-KW</td>
              </tr>
              <tr>
                <td>
                  <Input className={seamlessInputClass} style={{ fontSize: '10px' }} value={orderData.bestätigungsKW} />
                </td>
                <td>
                  <Input className={`${seamlessInputClass} text-center`}  value="0" style={{ fontSize: '10px' }} />
                </td>
                <td>
                  <Input className={seamlessInputClass} value={orderData.wunschKW} style={{ fontSize: '10px' }} />
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }}>Referenz</td>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }}>Auf. Art.</td>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }}>AES Verband</td>
              </tr>
              <tr>
                <td>
                  <Input className={seamlessInputClass} style={{ fontSize: '10px' }} value={orderData.referenz} />
                </td>
                <td>
                  <Input className={seamlessInputClass} style={{ fontSize: '10px' }} value="KD" />
                </td>
                <td>
                  <Input className={seamlessInputClass} style={{ fontSize: '10px' }} value="" />
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: '9px', backgroundColor: '#f3f4f6' }} colSpan={3}>Lieferadresse</td>
              </tr>
              <tr>
                <td  colSpan={3} className="h-10">
                  <div className="space-y-1">
                    {orderData.lieferadresse.map((line, index) => (
                      <Input key={index} className={seamlessInputClass} value={line} style={{ fontSize: '10px' }} />
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 mb-4 text-[7px]">
        <p>Vielen Dank, dass Sie sich für unser(e) Produkt(e) entschieden haben.</p>
      </div>

      {/* Table for items */}
      <div className="w-full">
      <table className="w-full border-collapse" style={{ fontSize: '12px' }}>
  <thead>
    <tr>
      <th className="bg-forestgreen text-white p-0.5 border border-gray-300 font-normal text-left">Artikelnr.</th>
      <th className="bg-forestgreen text-white p-0.5 border border-gray-300 font-normal text-left">Bezeichnung</th>
      <th className="bg-forestgreen text-white p-0.5 border border-gray-300 font-normal text-left">Menge</th>
      <th className="bg-forestgreen text-white p-0.5 border border-gray-300 font-normal text-left">Colli</th>
      <th className="bg-forestgreen text-white p-0.5 border border-gray-300 font-normal text-left">Preis</th>
      <th className="bg-forestgreen text-white p-0.5 border border-gray-300 font-normal text-left">MwST (%)</th>
      <th className="bg-forestgreen text-white p-0.5 border border-gray-300 font-normal text-left">Total EUR</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-gray-300">
      <td className="border border-gray-300">ARTONA</td>
      <td className="border border-gray-300">A6ARST081</td>
      <td className="border border-gray-300">
        <Input
          type="number"
          value={menge}
          onChange={(e) => setMenge(Number(e.target.value))}
          className={seamlessInputClass}
          style={{ fontSize: '10px' }}
        />
      </td>
      <td className="border border-gray-300">1</td>
      <td className="border border-gray-300">
        <Input
          type="number"
          value={preis}
          onChange={(e) => setPreis(Number(e.target.value))}
          className={seamlessInputClass}
          style={{ fontSize: '10px' }}
        />
      </td>
      <td className="border border-gray-300">
        <Input
          type="number"
          value={mwst}
          onChange={(e) => setMwst(Number(e.target.value))}
          className={seamlessInputClass}
          style={{ fontSize: '10px' }}
        />
      </td>
      <td className="border border-gray-300">{totalPreis.toFixed(2)}</td>
    </tr>
    {/* Second row of data */}
    <tr className="border-b border-gray-300">
      <td className="border border-gray-300">ARTONA</td>
      <td className="border border-gray-300">A6ARST082</td>
      <td className="border border-gray-300">
        <Input
          type="number"
          value={menge}
          onChange={(e) => setMenge(Number(e.target.value))}
          className={seamlessInputClass}
          style={{ fontSize: '10px' }}
        />
      </td>
      <td className="border border-gray-300">1</td>
      <td className="border border-gray-300">
        <Input
          type="number"
          value={preis}
          onChange={(e) => setPreis(Number(e.target.value))}
          className={seamlessInputClass}
          style={{ fontSize: '10px' }}
        />
      </td>
      <td className="border border-gray-300">
        <Input
          type="number"
          value={mwst}
          onChange={(e) => setMwst(Number(e.target.value))}
          className={seamlessInputClass}
          style={{ fontSize: '10px' }}
        />
      </td>
      <td className="border border-gray-300">{(2 * preis).toFixed(2)}</td>
    </tr>
  </tbody>
</table>

      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <div className="flex justify-between items-start mt-4">
    <div className="w-1/2 text-left text-[10px]">
      <p>
        Eventuelle Anderungen bitten wir Sie uns innerhalb 8 Tagen bekannt zu geben.
        Ansonsten gilt diese Auftragsbestatigung als genehmigt. Es gelten unsere 
        Allgemienen Geschaftsbedingungen, die unter www.forestdream.de hinterlegt sind.
        Die Ware bleibt bis zur vollstandigen Bezahlung unser Eigentum.
      </p>
    </div>
    
    <div className="w-1/2">
      <table className="w-full border-collapse" style={{ fontSize: '12px' }}>
        <tbody>
          <tr>
            <td className="border-t border-b border-gray-300 p-0.5">Zwischensumme</td>
            <td className="border-t border-b border-gray-300 p-0.5 pr-2">{totalPreis.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="border-t border-b border-gray-300 p-0.5">Nettobetrag</td>
            <td className="border-t border-b border-gray-300 p-0.8 pr-2">{totalPreis.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="border-t border-b border-gray-300 p-0.5">Mehrwertsteuer 19,0% (A2) auf</td>
            <td className="border-t border-b border-gray-300 p-0.8 pr-3">{mwstBetrag.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="border-t border-b border-gray-300 p-0.5">Total EUR with MwSt</td>
            <td className="border-t border-b border-gray-300 p-0.8 pr-3">{gesamt.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
</div>




<footer className="border-t border-gray-300 text-[10px] mt-8 py-4">
        <div className="grid grid-cols-3 gap-4 text-left">
          <div>
            <p className="font-bold">Geschäftsführer</p>
            <p>Kosove Artiaj, Jan Hendrik Demuth</p>
          </div>
          <div>
            <p className="font-bold">Handelsregister</p>
            <p>HRA 8319 HRB 13328</p>
          </div>
          <div className="mt-2">
          <p className="font-bold">Bankverbindung Sparkasse Herford</p>
          <p>Kto-Nr.: 84974 BLZ 44950120</p>
          <p>IBAN: DE04 4945 0120 0000 0894 74</p>
          <p>SWIFT: WLAHDE44XXX</p>
        </div>
        </div>

        
      </footer>

    </div>
  );
};

export default OrderConfirmation;
