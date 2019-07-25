const scale = (x) => {
    const scaled = (x * 127.5) + 127.5
    scaled < 0 ? 0 : scaled > 255 ? 255 : scaled
    // console.log(scaled)
    return scaled
}

export const Latent = ({data}) => (
    <div class='noise-viz'>        
        {data && data.map((c, i) => (
            <div class='noise-item' style={{background: `rgb(${scale(c)}, ${scale(c)}, ${scale(c)})`}}></div>
        ))}        
    </div>
)