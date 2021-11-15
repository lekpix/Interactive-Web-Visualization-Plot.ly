let sample_main=[];
let topten_samplevalue;
let topten_sample_otu_ids;

var selector = d3.select("#selDataset");

d3.json("samples.json").then(function(data) {
    console.log(data);
    var sampleNames = data.names;
    //Loading the dropdownmenu
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    //Setting default value for initial display
    let defaultsample = sampleNames[0];
    barchart(defaultsample);//function bar chart
    DemoInfo(defaultsample);//function Demographic Info
    gaugechart(defaultsample);//function Bonus gauge chart
});

//function bar chart
function barchart(defaultsample){
    //console.log(defaultsample);
    d3.json("samples.json").then(function(data) {
        let samplemain= data.samples;
        //Filtering for correct id 
        let sampledata= samplemain.filter(sampleid => sampleid.id == defaultsample);
        //console.log(`Sample:`,sampledata);
        let sample=sampledata[0];
        let otu_ids= sample.otu_ids;
        let sample_values= sample.sample_values;
        let    otu_labels=sample.otu_labels;
        //slicing out 10 values
        topten_samplevalue=sample_values.slice(0,10).reverse();

         topten_sample_otu_ids=otu_ids.slice(0,10).reverse();
         topten_otu_labels=otu_labels.slice(0,10).reverse();
         
         let trace={
            x:topten_samplevalue,
            y:topten_sample_otu_ids.map(otuID => `OTU ${otuID}`),
            text:topten_otu_labels,
            type:"bar",
            orientation:'h'
            };
        let traceData = [trace];
        // Apply the group barmode to the layout
        let layout = {
            title: "Bar chart"
        };
            
        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", traceData, layout);    
        //calling function bubble chart
        bubblechart(sample);      
    });
}   
//function bubble chart
function bubblechart(sample){
    //console.log(`Bubble chart:`,sample);
    let otu_ids= sample.otu_ids;
    let sample_values= sample.sample_values;
    let otu_labels=sample.otu_labels;

    let trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size:sample_values
        }
      };
    let data = [trace1];
    let layout = {
        title: 'Bubble Chart ',
        xaxis: { title: "OTU ID" }
    };
    
     
      Plotly.newPlot("bubble", data,layout);
}
////function Demographic Info
function DemoInfo(defaultsample){
    d3.json("samples.json").then(function(data) {
        //console.log(data);
        let sampledemo= data.metadata;
        
        let demodata= sampledemo.filter(sampleid => sampleid.id == defaultsample);
        //console.log(`Sampledemo:`,demodata);
        let demoresult=demodata[0];
       // #sample-metadata
       let panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(demoresult).forEach(([key, value]) => {
        panel.append("h6").text(`${key}: ${value}`);
    });

    });
}
////function dropdown menu change
function optionChanged(sample) {
    
    //console.log(`dataset:`,sample);
    barchart(sample);
    DemoInfo(sample);
    gaugechart(sample)
}

//function Bonus gauge chart
function gaugechart(defaultsample){
    d3.json("samples.json").then(function(data) {
        //console.log(data);
        let sampledemo= data.metadata;
        let demodata= sampledemo.filter(sampleid => sampleid.id == defaultsample);
        //console.log(`Sampledemo:`,demodata);
        let demoresult=demodata[0];
        wfreq_value=demoresult.wfreq;
        var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq_value,
          title: { text:"Scrubs per week"},
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0,1], color: "#ffffff" },
              { range: [1,2], color: "#ecf9f2" },
              { range: [2,3], color: "#d9f2e6" },
              { range: [3,4], color: "#c6ecd9" },
              { range: [4,5], color: "#b3e6cc" },
              { range: [5,6], color: "#9fdfbf" },
              { range: [6,7], color: "#8cd9b3" },
              { range: [7,8], color: "#79d2a6" },
              { range: [8,9], color: "#66cc99" }
            ],
            }
        }
        ];
    
        var layout = { width: 450, height: 450};
        Plotly.newPlot('gauge', data, layout);
    });
}