import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// React-Multi-Carousel 라이브러리 사용
// https://www.npmjs.com/package/react-multi-carousel?activeTab=readme

const responsive = {
  desk: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 576 },
    items: 6
  },
  mobile: {
    breakpoint: { max: 576, min: 0 },
    items: 4
  }
};

export default function ScrollableBar({ children }: { children: React.ReactNode }){
    return (
        <Carousel 
            containerClass='w-full flex gap-2'                                   
            responsive={responsive}                      
            >
            {children}
        </Carousel>
    );
}