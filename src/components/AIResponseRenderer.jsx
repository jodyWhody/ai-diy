import React from 'react';

const AIResponseRenderer = ({ response }) => {
  let responseText = '';
  
  if (typeof response === 'string') {
    responseText = response;
  } else {
    responseText = response.aiResponse || 
                   response.content || 
                   response.message || 
                   response.response || 
                   JSON.stringify(response, null, 2);
  }
  
  const sections = responseText.split('\n\n');
  const materialsSection = sections.find(section => section.startsWith('MATERIALS:'));
  const directionsSection = sections.find(section => section.startsWith('DIRECTIONS:'));
  
  if (materialsSection || directionsSection) {
    return (
      <div className="space-y-6">
        {materialsSection && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-blue-300 flex items-center">
              📦 Materials Needed
            </h3>
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="text-white space-y-1">
                {materialsSection.split('\n').slice(1).map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-blue-300 mr-2">•</span>
                    <span>{item.replace(/^- /, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {directionsSection && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-blue-300 flex items-center">
              🔨 Step-by-Step Directions
            </h3>
            <div className="bg-gray-600 rounded-lg p-4">
              <div className="text-white space-y-3">
                {directionsSection.split('\n').slice(1).map((step, index) => (
                  <div key={index} className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{step.replace(/^\d+\. /, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return <div className="whitespace-pre-wrap text-white">{responseText}</div>;
};

export default AIResponseRenderer;