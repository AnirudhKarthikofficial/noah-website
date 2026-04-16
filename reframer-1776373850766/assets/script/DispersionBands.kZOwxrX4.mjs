import{t as e}from"./rolldown-runtime.DsXBSD_B.mjs";import{R as t,r as n,w as r}from"./framer.XnU7V7sl.mjs";var i,a=e((()=>{t(),i=r({title:`Bands`,fragment:`
const int SAMPLES = 8;
const float EPHEMERAL_DRIP = 1.0;

// === PCG hash - https://www.jcgt.org/published/0009/03/02/
uvec3 hash3(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z;
    v.y += v.z * v.x;
    v.z += v.x * v.y;
    return v;
}
uvec3 seed;
vec3 random3f() {
    seed = hash3(seed);
    return vec3(seed) / float(-1u);
}

vec3 seedRandom(float seedVal) {
    uvec3 s = uvec3(
        floatBitsToUint(seedVal),
        floatBitsToUint(seedVal * 1.5 + 7.31),
        floatBitsToUint(seedVal * 2.7 + 13.37)
    );
    s = hash3(s);
    return vec3(s) / float(0xFFFFFFFFu);
}

// === PALETTE SAMPLING ===
vec3 getColor(int idx) {
    if (u_colors_length < 1) return vec3(0.0);
    int safeIdx = clamp(idx, 0, u_colors_length - 1);
    return u_colors[safeIdx].rgb;
}

vec3 paletteN(float t, int count) {
    if (count < 1) return vec3(0.0);
    if (count < 2) return getColor(0);
    t = clamp(t, 0.0, 1.0) * float(count - 1);
    int idx = min(int(floor(t)), count - 2);
    float localT = fract(t);
    localT = localT * localT * (3.0 - 2.0 * localT);
    return mix(getColor(idx), getColor(idx + 1), localT);
}

// === Gradient Flow ===
float getGradientT(vec2 uv, float t, vec3 s1, vec3 s2) {
    // Seed-derived flow directions
    float angle1 = s1.x * 6.28;
    float angle2 = s1.y * 6.28;
    vec2 dir1 = vec2(cos(angle1), sin(angle1));
    vec2 dir2 = vec2(cos(angle2), sin(angle2));
    
    // Seed-derived frequencies
    float freq1 = 1.0 + s1.z * 2.0;
    float freq2 = 1.0 + s2.x * 1.5;
    float freq3 = 1.5 + s2.y * 2.0;
    
    float flow = dot(uv, dir1) + sin(dot(uv, dir2) * freq1 + t) * 0.3 + t * 0.2;
    float flow2 = dot(uv, dir2.yx) + cos(dot(uv, dir1.yx) * freq2 - t * 0.8) * 0.25;
    
    float gradT = sin(flow * 1.5) * 0.5 + 0.5;
    gradT += cos(flow2 * 1.2) * 1.3;
    gradT += sin(dot(uv, dir1 + dir2) * freq3 + t * 3.5) * 1.2;
    
    return smoothstep(0.0, 4.12, gradT);
}

// === BAND LENS ===
void applyBandLens(vec2 pp, float radiusSq, float iorOffset, out vec2 warpedUV, out float edgeFactor) {
    vec2 ppLens = pp;
    float spacingX = max(u_lensSpacingX, 0.001);
    float spacingY = max(u_lensSpacingY, 0.001);
    ppLens.x = fract(pp.x / spacingX + 0.5) * spacingX - spacingX * 0.5;
    ppLens.y = fract(pp.y / spacingY + 0.5) * spacingY - spacingY * 0.5;

    float sp = radiusSq - ppLens.x * ppLens.x - ppLens.y * ppLens.y;
    
    float lensAmount = smoothstep(-0.1, 0.05, sp);
    float baseLens = sqrt(max(sp, -sp * 0.1) / 0.3);
    edgeFactor = (1.0 - smoothstep(0.0, radiusSq, sp)) * lensAmount;
    
    float warpAmount = mix(1.0, baseLens * (1.0 + iorOffset), lensAmount);
    
    warpedUV = pp;
    warpedUV.x += (ppLens.x * warpAmount - ppLens.x);
    warpedUV.y *= warpAmount;
}

void main() {
    vec2 fragCoord = v_uv * u_resolution;
    seed = uvec3(uvec2(fragCoord), uint(fract(u_time) * 1000.0));
    
    vec2 r = u_resolution;
    vec2 p = (fragCoord * 2.0 - r) / r.y;
    float t = u_time * u_speed;
    
    int colorCount = u_colors_length;
    
    // Early out: no colors -> black
    if (colorCount < 1) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    // Seed-based offsets for gradient flow
    vec3 seedOff1 = seedRandom(u_seed);
    vec3 seedOff2 = seedRandom(u_seed + 100.0);
    
    float dice = random3f().x;
    
    float radiusSq = u_lensRadius * u_lensRadius;
    vec3 iorOffsets = vec3(-1.0, 0.0, 1.0) * u_dispersionStrength;
    
    vec3 col = vec3(0.0);
    
    for (int i = 0; i < SAMPLES; i++) {
        float ephemeral = (float(i) + dice) / float(SAMPLES);
        float sqEph = ephemeral * ephemeral;
        
        vec2 pt = p;
        pt.x += u_ephemeralAmp * sqEph * sin(p.y * 2.0 + t);
        pt.y += u_ephemeralAmp * sqEph * cos(p.x * 1.5 - t) * 0.5;
        pt.y -= (1.0 - exp(-EPHEMERAL_DRIP * sqEph)) * abs(pt.y) * sign(pt.y) * 0.3;
        
        vec3 tint = smoothstep(1.0, 0.0, abs(3.0 * ephemeral - vec3(1.0, 1.5, 2.0)));
        
        vec3 gradTs = vec3(0.0);
        vec3 edgeFactors = vec3(0.0);
        
        for (int c = 0; c < 3; c++) {
            vec2 pp = pt * u_lensScale;
            vec2 warpedUV;
            float edgeFactor;
            applyBandLens(pp, radiusSq, iorOffsets[c], warpedUV, edgeFactor);
            
            vec2 gradUV = warpedUV / u_lensScale;
            gradTs[c] = getGradientT(gradUV, t * 0.8, seedOff1, seedOff2);
            edgeFactors[c] = edgeFactor;
        }
        
        vec3 convergentColor = paletteN(gradTs.g, colorCount);
        float edgeMix = max(max(edgeFactors.r, edgeFactors.g), edgeFactors.b);
        
        vec3 dispersedColor = vec3(
            paletteN(gradTs.r, colorCount).r,
            convergentColor.g,
            paletteN(gradTs.b, colorCount).b
        );
        
        vec3 finalColor = mix(convergentColor, dispersedColor, edgeMix * 2.0);
        
        vec3 rainbow = (gradTs - gradTs.g) * 3.0;
        finalColor += rainbow * edgeMix * u_edgeDisp;
        
        col += tint * finalColor * (3.0 / float(SAMPLES));
    }
    
    fragColor = vec4(col, 1.0);
}
`,propertyControls:{colors:{type:n.Array,title:`Colors`,control:{type:n.Color},maxCount:8,defaultValue:[`#4AB7FF`,`#FFC680`,`#FF4040`]},seed:{type:n.Number,title:`Seed`,defaultValue:210,min:0,max:1e3,step:1},speed:{type:n.Number,title:`Speed`,defaultValue:.3,min:0,max:2,step:.01},ephemeralAmp:{type:n.Number,title:`Ephemeral`,defaultValue:0,min:0,max:.5,step:.01},lensScale:{type:n.Number,title:`Scale`,defaultValue:3.7,min:.1,max:10,step:.1},lensSpacingX:{type:n.Number,title:`Spacing`,defaultValue:1,min:.01,max:5,step:.01},lensSpacingY:{type:n.Number,title:`Spacing Y`,defaultValue:.01,min:.01,max:5,step:.01,hidden:!0},lensRadius:{type:n.Number,title:`Radius`,defaultValue:.58,min:.1,max:2,step:.01},dispersionStrength:{type:n.Number,title:`Dispersion`,defaultValue:.4,min:0,max:1,step:.01},edgeDisp:{type:n.Number,title:`Edges`,defaultValue:2,min:0,max:5,step:.1}}})}));export{a as n,i as t};
//# sourceMappingURL=DispersionBands.kZOwxrX4.mjs.map