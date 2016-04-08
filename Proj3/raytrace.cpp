//
// raytrace.cpp
//
//formular sheet ppt page below
//https://ccle.ucla.edu/pluginfile.php/1146696/mod_resource/content/1/lecture11-illumination.pdf
//https://ccle.ucla.edu/pluginfile.php/1146695/mod_resource/content/1/lecture12-raytracing.pdf
#define _CRT_SECURE_NO_WARNINGS
#include "matm.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <cstdlib>
using namespace std;

int g_width;
int g_height;
/// structures
struct Ray
{
    vec4 origin;
    vec4 dir;
};

struct colors {

    float red,green,blue;

    colors() : red(0.0), green(0.0), blue(0.0) {}

    colors(float R, float G, float B) : red(R), green(G), blue(B) {}

    colors(const colors &ccc) : red(ccc.red), green(ccc.green), blue(ccc.blue) {}

    colors operator + (const colors &ccc)const
    {
        return colors(red + ccc.red, green + ccc.green, blue + ccc.blue);
    }

    colors operator += (const colors &ccc)
    {
        red += ccc.red;
        green += ccc.green;
         blue += ccc.blue;
         return *this;
    }

} background;


struct Sphere
{
    string name;

    float position_x;
    float position_y;
    float position_z;

    float scaling_x;
    float scaling_y;
    float scaling_z;

    colors ccc;

    float K_a;
    float K_d;
    float K_s;
    float K_r;

    float n;

    mat4 Matrix;
    mat4 Matrix_inverse;
    mat4 matrix_scaling;
    mat4 scaling_inverse;
};

struct Light
{
    string name;
    float position_x;
    float position_y;
    float position_z;

    float intensity_x;
    float intensity_y;
    float intensity_z;
};
inline vec3 toVec3(vec4 in)
{
	return vec3(in[0], in[1], in[2]);
}

string output;
//vectors
vector<Sphere> g_sphere;
vector<Light> g_Light;

vector<vec4> g_colors;
float g_left;
float g_right;
float g_top;
float g_bottom;
float g_near;

// Background color
float back_red;
float back_green;
float back_blue;

//Ambient intensity
float amb_red;
float amb_green;
float amb_blue;

vec4 eye = vec4(0.0f, 0.0f, 0.0f, 1.0f);
vec4 trace(const Ray& ray, int ln);
inline
mat4 Getmatrix(Sphere ss)
{
    mat4 shpere_matrix=mat4();
    shpere_matrix *=Translate(ss.position_x,ss.position_y,ss.position_z);
    shpere_matrix *=Scale(ss.scaling_x,ss.scaling_y,ss.scaling_z);
     return shpere_matrix;
}
inline mat4 getinversematrix(Sphere ss)
{
    mat4 matrix=Getmatrix(ss);
    mat4 inverse;
    bool check=InvertMatrix(matrix,inverse);
    if (check)
        return inverse;
    else
    {
        cout<<"Matrix is not invertible"<<endl;
        exit(1);
    }

}
inline mat4 scalematrix(Sphere ss)
{
    mat4 matrix=mat4();
    matrix *= Scale(ss.scaling_x,ss.scaling_y,ss.scaling_z);
    return matrix;
}
inline mat4 inversescale(Sphere ss)
{
    mat4 matrix =scalematrix(ss);
    mat4 inverse;
    bool check=InvertMatrix(matrix,inverse);
    if (check)
        return inverse;
    else
    {
        cout<<"Matrix is not invertible"<<endl;
        exit(1);
    }
}


vec4 toVec4(const string& s1, const string& s2, const string& s3)
{
    stringstream ss(s1 + " " + s2 + " " + s3);
    vec4 result;
    ss >> result.x >> result.y >> result.z;
    result.w = 1.0f;
    return result;
}

float toFloat(const string& s)
{
    stringstream ss(s);
    float f;
    ss >> f;
    return f;
}
// -------------------------------------------------------------------
// Input file parsing

void parseLine(const vector<string>& vs)
{
    if (vs[0] == "RES") {

        g_width = (int)toFloat(vs[1]);
        g_height = (int)toFloat(vs[2]);
        g_colors.resize(g_width * g_height);

    } else if (vs[0] == "NEAR")

        g_near = toFloat(vs[1]);

     else if (vs[0] == "LEFT")

        g_left = toFloat(vs[1]);

     else if (vs[0] == "RIGHT")

        g_right = toFloat(vs[1]);

     else if (vs[0] == "BOTTOM")

        g_bottom = toFloat(vs[1]);

    else if (vs[0] == "TOP")

        g_top = toFloat(vs[1]);

    else if (vs[0] == "SPHERE")
     {
            Sphere sss;
            sss.name = vs[1];
            sss.position_x = toFloat(vs[2]);
            sss.position_y = toFloat(vs[3]);
            sss.position_z = toFloat(vs[4]);
            sss.scaling_x = toFloat(vs[5]);
            sss.scaling_y = toFloat(vs[6]);
            sss.scaling_z = toFloat(vs[7]);
            sss.ccc.red = toFloat(vs[8]);
            sss.ccc.green = toFloat(vs[9]);
            sss.ccc.blue = toFloat(vs[10]);
            sss.K_a = toFloat(vs[11]);
            sss.K_d = toFloat(vs[12]);
            sss.K_s = toFloat(vs[13]);
            sss.K_r = toFloat(vs[14]);
            sss.n = toFloat(vs[15]);
            sss.Matrix =Getmatrix(sss);
            sss.Matrix_inverse=getinversematrix(sss);
            sss.matrix_scaling=scalematrix(sss);
            sss.scaling_inverse=inversescale(sss);
            g_sphere.push_back(sss);
        }

     else if (vs[0] == "LIGHT")
        {
            Light light;
            light.name = vs[1];
            light.position_x= toFloat(vs[2]);
            light.position_y = toFloat(vs[3]);
            light.position_z = toFloat(vs[4]);
            light.intensity_x = toFloat(vs[5]);
            light.intensity_y = toFloat(vs[6]);
            light.intensity_z = toFloat(vs[7]);
            g_Light.push_back(light);
        }

     else if (vs[0] == "BACK")
        {
        background.red = toFloat(vs[1]);
        background.green = toFloat(vs[2]);
        background.blue = toFloat(vs[3]);
       }
    else if (vs[0] == "AMBIENT")
     {
        amb_red = toFloat(vs[1]);
        amb_green = toFloat(vs[2]);
        amb_blue = toFloat(vs[3]);
    }
     else if (vs[0] == "OUTPUT")
    {
        output = vs[1];
    }
}

void loadFile(const char* filename)
{
    ifstream is(filename);
    if (is.fail())
    {
        cout << "Could not open file " << filename << endl;
        exit(1);
    }
    string s;
    vector<string> vs;
    while(!is.eof())
    {
        vs.clear();
        getline(is, s);
        istringstream iss(s);
        while (!iss.eof())
        {
            string sub;
            iss >> sub;
            vs.push_back(sub);
        }
        parseLine(vs);
    }
}


// -------------------------------------------------------------------
// Utilities

void setColor(int ix, int iy, const vec4& color)
{
    int iy2 = g_height - iy - 1; // Invert iy coordinate.
    g_colors[iy2 * g_width + ix] = color;
}


// -------------------------------------------------------------------
// Intersection routine


colors getillumination(Light l, vec4 point, Sphere ss)
{

        vec4 lightp = vec4(l.position_x, l.position_y, l.position_z, 1.0f);
        vec4 lightv = normalize(lightp - point); // normal point to light
        mat4 mInv = ss.scaling_inverse;

        vec4 Center = vec4(ss.position_x, ss.position_y, ss.position_z, 1.0f);
        vec4 nn = point - Center;
        vec4 uu = normalize(mInv * nn);
       vec4 normal = normalize(mInv * uu);  //  Normal

       float Red=0,Green=0,Blue=0,Red1=0,Green1=0,Blue1=0;
       bool blocked=false;
       bool blocked2=false;

       float NdotL = dot(normal, lightv);   // Calculate dot product N L

        // if ray blocked
        if (NdotL < 0)
            blocked=true;

         if (!blocked)
         {
              Red = ss.K_d * l.intensity_x * NdotL * ss.ccc.red;
            Green = ss.K_d * l.intensity_y * NdotL * ss.ccc.green;
            Blue = ss.K_d * l.intensity_z * NdotL * ss.ccc.blue;
         }
         //I=I_l*K_d*NdotL

        vec4 R =  2*normal * dot(normal, lightv) - lightv;//R=2n*NdotL-L
        vec4 V = normalize(eye - point);
        colors specular();

        float RdotV = dot(R, V);  // Calculate dot product RV
        float Rdotvpown = pow(RdotV, ss.n);

        if (RdotV < 0) // if ray blocked
         blocked2=true;


       if (!blocked2)
       {
          Red1 = ss.K_s * l.intensity_x * Rdotvpown;//I_L*K_S*(RdotV)^n
          Green1 = ss.K_s * l.intensity_y * Rdotvpown;//I_L*K_S*(RdotV)^n
          Blue1 = ss.K_s * l.intensity_z * Rdotvpown;//I_L*K_S*(RdotV)^n
       }

        colors illuminat=colors();
        illuminat+=colors(Red, Green, Blue);
         illuminat+=colors(Red1, Green1, Blue1);

        return illuminat;//I=I_l*K_d*NdotL+I_L*K_S*(RdotV)^n


}
colors getshadowray(Light l, vec4 point, Sphere pp)
{

    vec4 ray2L = vec4(l.position_x, l.position_y, l.position_z, 1.0f)- point;


     Sphere temp;
     colors ccc1 = colors();
     int num = g_sphere.size();
     float t =-1;
     float tt=-1;
     bool check = false;

    for (int i = 0; i < num; i++) {

        temp = g_sphere[i];

        mat4 mInv = temp.Matrix_inverse;
        vec4 ss = mInv * point;
        vec4 cc = mInv * ray2L;

		float a = dot(toVec3(cc), toVec3(cc));

		float b = dot(toVec3(ss), toVec3(cc));

		float c = dot(toVec3(ss), toVec3(ss)) - 1;

		float dd = powf(b, 2) - a*c;

        if (dd < 0.0) //  no intersection
           {
			continue;//do nothing
		}
         else if (dd == 0.0)  //One Intersection
            t = -b/a;

         else //Two intersections
            {
            float t1 = (-b + sqrt(dd)) / a;
            float t2 = (-b - sqrt(dd)) / a;
            t = t1;
            tt=t2;
        }

        // Check for block or not
        if (t <1.0 && t > 0.0001)

        {
            check = true;
            break;
        }
        if (tt < 1.0 && tt > 0.0001)

        {
            check = true;
            break;
        }


    }



    if (!check) //if not block (block return 0.0)
        ccc1 = getillumination(l, point, pp); // Calculate  illumination

    return ccc1;
}

colors tracehelp(const Ray& ray, int ln) {

    Sphere temp;
    Sphere temp2;
    Sphere closest;

        float tmin;
        float t=-1 ;
        float tt=-1;
        float tMax = -1;
        bool check2=false;
    int num = g_sphere.size();

    for (int i = 0; i < num; i++) {

        temp = g_sphere[i];
        mat4 mInv = getinversematrix(temp);
        vec4 ss = mInv * ray.origin;
        vec4 cc = mInv * ray.dir;

        float a = dot(toVec3(cc), toVec3(cc));

		float b = dot(toVec3(ss), toVec3(cc));

		float c = dot(toVec3(ss), toVec3(ss)) - 1;

		float dd = powf(b, 2) - a*c;

        if (dd < 0.0) //  no intersection
           {
			continue;//do nothing
		}
         else if (dd == 0.0)  //One Intersection
            t = -b/a;

         else //Two intersections
            {
            float t1 = (-b + sqrt(dd)) / a;
            float t2 = (-b - sqrt(dd)) / a;
            t = t1;
            tt=t2;
        }

        if (ln!=5)
            tmin=0.0001;
        else
            tmin=1.0;


        if (tMax == -1 || t < tMax)// finding closet sphere
            {
            if (t >tmin) {

                tMax = t;
                closest = temp;
            }
        }
        if (tMax == -1 || tt < tMax)// finding closet sphere
            {
            if (tt >tmin) {

                tMax = tt;
                closest = temp;
            }
        }

    }



    if (tMax == -1.0) {
        if (ln==5)
        return background;

        else
            return colors();
    }

    // intersection point
     colors localc = colors();

     vec4 point = ray.dir * tMax+ray.origin ;

      size_t num1 = g_Light.size();


    // Loop all light calculate local shadow
    for (int i = 0; i < num1; i++)
    localc += getshadowray(g_Light[i], point, closest);



    colors reflectc = colors(); // Reflect ray
    if (ln !=0) //reflect level base case
        {

        mat4 mInv = closest.scaling_inverse;
        vec4 Center = vec4(closest.position_x, closest.position_y, closest.position_z, 1.0f);
        vec4 normal = point - Center;
        vec4 uu = normalize(mInv * normal);
        normal = normalize(mInv * uu); // Normal


        vec4 lightn = normalize(ray.dir);
        float NdotL = dot(normal, lightn);

        // Check if ray blocked
        if (NdotL < 0)
        {
            Ray reflectray = Ray();
            reflectray.origin = point;
            reflectray.dir = -2 * normal * NdotL + lightn;
            vec4 traceVec = trace(reflectray, ln - 1);
            float red=traceVec.x * closest.K_r;
            float green=traceVec.y * closest.K_r;
            float blue=traceVec.z * closest.K_r;
            reflectc = colors(red,green,blue);//calculated reflection color
        }
    }

    float Red = closest.K_a * amb_red * closest.ccc.red;
    float Green = closest.K_a * amb_green * closest.ccc.green;
    float Blue = closest.K_a * amb_blue * closest.ccc.blue;
    colors ambient = colors(Red, Green, Blue);    // calculated Ambient color

    return (localc + reflectc + ambient);// return added

}


// -------------------------------------------------------------------
// Ray tracing

vec4 trace(const Ray& ray, int rl)
{
    // TODO: implement your ray tracing routine here.

    colors ccc = tracehelp(ray, rl); //tracehelp which helper for recursion
    return vec4(ccc.red, ccc.green, ccc.blue, 1.0f);
}

vec4 getDir(int ix, int iy)
{
    // TODO: modify this. This should return the direction from the origin
    // to pixel (ix, iy), normalized.
    float u_c = g_left + (g_right - g_left) * (ix / (g_width - 1.0));
    float v_r = g_bottom + (g_top - g_bottom) * (iy / (g_height - 1.0));
    float n = -g_near;

    vec4 dir;
    dir = vec4(u_c, v_r, n, 0.0f);
    return normalize(dir);
}

void renderPixel(int ix, int iy)
{
    Ray ray;
    ray.origin = vec4(0.0f, 0.0f, 0.0f, 1.0f);
    ray.dir = getDir(ix, iy);
    vec4 color = trace(ray, 5);
    setColor(ix, iy, color);
}

void render()
{
    for (int iy = 0; iy < g_height; iy++)
        for (int ix = 0; ix < g_width; ix++)
            renderPixel(ix, iy);
}


// -------------------------------------------------------------------
// PPM saving

void savePPM(int Width, int Height, string fname, unsigned char* pixels)
{
    const char * fname1 = fname.c_str();

    FILE *fp;
    const int maxVal=255;

    printf("Saving image %s: %d x %d\n", fname1, Width, Height);
    fp = fopen(fname1,"wb");
    if (!fp) {
        printf("Unable to open file '%s'\n", fname1);
        return;
    }
    fprintf(fp, "P6\n");
    fprintf(fp, "%d %d\n", Width, Height);
    fprintf(fp, "%d\n", maxVal);

    for(int j = 0; j < Height; j++) {
        fwrite(&pixels[j*Width*3], 3, Width, fp);
    }

    fclose(fp);
}

void saveFile()
{
    // Convert color components from floats to unsigned chars.
    // TODO: clamp values if out of range. -- Done
    unsigned char* buf = new unsigned char[g_width * g_height * 3];
    for (int y = 0; y < g_height; y++)
        for (int x = 0; x < g_width; x++)
            for (int i = 0; i < 3; i++)
                buf[y*g_width*3+x*3+i] = (unsigned char) min((((float*)g_colors[y*g_width+x])[i] * 255.9f), 255.9f);

    // TODO: change file name based on input file name.
    savePPM(g_width, g_height, output, buf);
    delete[] buf;
}


// -------------------------------------------------------------------
// Main

int main(int argc, char* argv[])
{
if (argc < 2)
	{
		cout << "Usage: template-rt <input_file.txt>" << endl;
		exit(1);
	}
	loadFile(argv[1]);
    render();
    saveFile();
	return 0;
}

