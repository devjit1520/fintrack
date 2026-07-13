import { motion } from "framer-motion";

import {
  FileText,
  FileDown,
  Printer,
} from "lucide-react";


import html2canvas from "html2canvas";
import jsPDF from "jspdf";


import Card from "../common/Card";

import useFinance from "../../hooks/useFinance";



function ExportAnalytics({
  analyticsRef,
}) {


  const {
    transactions = [],
  } = useFinance();






  const exportCSV = () => {


    if(!transactions.length){

      alert(
        "No transactions available."
      );

      return;

    }




    const header = [

      "Title",
      "Category",
      "Type",
      "Amount",
      "Date",

    ];




    const rows =
      transactions.map(
        (t)=>[

          t.title,
          t.category,
          t.type,
          t.amount,
          t.date,

        ]
      );






    const csv = [

      header.join(","),

      ...rows.map(
        (r)=>
          r.join(",")
      ),

    ].join("\n");







    const blob =
      new Blob(
        [csv],
        {
          type:"text/csv",
        }
      );



    const url =
      URL.createObjectURL(
        blob
      );



    const link =
      document.createElement(
        "a"
      );



    link.href=url;

    link.download=
      "FinTrack_Report.csv";



    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );


    URL.revokeObjectURL(
      url
    );


  };









  const exportPDF = async()=>{


    try{


      const page =
        analyticsRef?.current;




      if(!page){

        alert(
          "Analytics page not found."
        );

        return;

      }





      const canvas =
        await html2canvas(
          page,
          {

            scale:2,

            useCORS:true,

            backgroundColor:
              document.documentElement
              .classList
              .contains("dark")
              ?
              "#0f172a"
              :
              "#ffffff",

          }
        );







      const imgData =
        canvas.toDataURL(
          "image/png"
        );



      const pdf =
        new jsPDF(
          "p",
          "mm",
          "a4"
        );



      const width =
        pdf.internal
        .pageSize
        .getWidth();




      const height =
        (
          canvas.height *
          width
        )
        /
        canvas.width;





      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        width,
        height
      );



      pdf.save(
        "FinTrack_Analytics.pdf"
      );



    }


    catch(error){


      console.error(error);


      alert(
        "Failed to export PDF."
      );


    }


  };








  const printReport =()=>{

    window.print();

  };








  const buttons = [


    {

      title:"Export CSV",

      icon:FileText,

      action:exportCSV,

      style:
      "from-green-500 to-emerald-600",

    },



    {

      title:"Export PDF",

      icon:FileDown,

      action:exportPDF,

      style:
      "from-blue-500 to-indigo-600",

    },



    {

      title:"Print Report",

      icon:Printer,

      action:printReport,

      style:
      "from-slate-600 to-slate-800",

    },


  ];








  return (



    <Card


      className="

        relative

        overflow-hidden


        rounded-3xl


        border


        border-slate-200


        bg-white


        p-8


        shadow-xl


        shadow-slate-200/40


        backdrop-blur-xl




        dark:border-white/10


        dark:bg-slate-900/70


        dark:shadow-black/30

      "


    >





      {/* Glow */}


      <div

        className="

          absolute

          -right-20

          -top-20


          h-48

          w-48


          rounded-full


          bg-blue-500/20


          blur-3xl

        "

      />








      <h2

        className="

          relative

          mb-6


          text-2xl


          font-extrabold


          text-slate-900



          dark:text-white

        "

      >

        Export Reports

      </h2>







      <div

        className="

          relative

          flex

          flex-wrap


          gap-4

        "

      >



        {
          buttons.map(
            (btn)=>

            {


              const Icon =
                btn.icon;



              return (


                <motion.button


                  key={btn.title}


                  whileHover={{
                    scale:1.05,
                    y:-3,
                  }}


                  whileTap={{
                    scale:0.95,
                  }}



                  onClick={
                    btn.action
                  }


                  className={`

                    flex

                    items-center

                    gap-2


                    rounded-2xl


                    bg-gradient-to-r


                    ${btn.style}


                    px-6

                    py-3


                    font-semibold


                    text-white


                    shadow-lg

                    transition

                  `}


                >


                  <Icon size={20}/>


                  {btn.title}


                </motion.button>



              );

            }

          )
        }



      </div>




    </Card>


  );

}


export default ExportAnalytics;