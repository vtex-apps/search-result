import Img from 'vtex.render/Img'
import Slider from 'vtex.react-slick'
import React, {Component, PropTypes} from 'react'

// eslint-disable-next-line
class Gallery extends Component {
  render() {
    const {selectedSku} = this.props
    const images = (selectedSku && selectedSku.images) || []
    const thumbnails = images.map(({src}) => ({ src, width: 640, height: 640 }))
    return (
      <Slider
        thumbs={!!thumbnails}
        thumbsElements={thumbnails}
        arrows
        infinite
        autoplay={false}
        draggable
        slidesToShow={1}
        slidesToScroll={1}
        className="mb5 center tc pb1"
        >
        {
          images.map((img) => (
            <div key={img.src}>
              <Img
                alt={img.title}
                className="h-auto"
                height={640}
                src={img.src}
                width={640}
                />
            </div>
          ))
        }
      </Slider>
    )
  }
}

Gallery.propTypes = {
  selectedSku: PropTypes.object,
}

export default Gallery
