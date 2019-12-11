using System;
using System.Collections;
using System.Collections.Generic;
using System.Numerics;
using UnityEngine;

public class Mobius {
    private Complex[] coeff;

    public Mobius() {
        coeff = new Complex[] {
            new Complex(1, 0),
            new Complex(0, 0),
            new Complex(0, 0),
            new Complex(1, 0),
        };
    }

    public Mobius(Complex translation, bool norm) {
        if (translation.Magnitude > 0 && norm)
            translation *= Math.Tanh(translation.Magnitude / 2) / translation.Magnitude;
        coeff = new Complex[] {
            new Complex(1, 0),
            translation,
            Complex.Conjugate(translation),
            new Complex(1, 0),
        };
    }

    public Mobius(double re, double im, bool norm) : this(new Complex(re, im), norm) {}

    public Mobius(double rotation) {
        coeff = new Complex[] {
            Complex.FromPolarCoordinates(1, rotation),
            new Complex(0, 0),
            new Complex(0, 0),
            new Complex(1, 0),
        };
    }

    public Mobius(Complex translation, double rotation, bool norm) {
        if (translation.Magnitude > 0 && norm)
            translation *= Math.Tanh(translation.Magnitude / 2) / translation.Magnitude;
        coeff = new Complex[] {
            Complex.FromPolarCoordinates(1, rotation),
            translation * Complex.FromPolarCoordinates(1, rotation),
            Complex.Conjugate(translation),
            new Complex(1, 0),
        };
    }

    public Mobius(double re, double im, double rotation, bool norm) : this(new Complex(re, im), rotation, norm) {}

    public Mobius(Mobius other) {
        coeff = other.getCoeff();
    }
    
    public UnityEngine.Vector3 apply(UnityEngine.Vector3 v, bool norm) {
        Complex c = new Complex(v.x, v.z);
        //Debug.Log("In: " + c);
        if (c.Magnitude > 0) c *= Math.Tanh(c.Magnitude / 2) / c.Magnitude;
        //Debug.Log("Thru: " + c);
        c = (c * coeff[0] + coeff[1]) / (c * coeff[2] + coeff[3]);
        //Debug.Log("Mid: " + c);
        if (c.Magnitude > 0 && norm) c *= (Math.Log(1 + c.Magnitude) - Math.Log(1 - c.Magnitude)) / c.Magnitude;
        //Debug.Log("Out: " + c);
        return new UnityEngine.Vector3((float) c.Real, v.y, (float) c.Imaginary);
    }

    public void accumulate(Mobius other) {
        Complex[] p = other.getCoeff();
        Complex[] q = coeff;
        coeff = new Complex[] {
            p[0] * q[0] + p[1] * q[2],
            p[0] * q[1] + p[1] * q[3],
            p[2] * q[0] + p[3] * q[2],
            p[2] * q[1] + p[3] * q[3],
        };
    }

    public void compose(Mobius other) {
        Complex[] p = coeff;
        Complex[] q = other.getCoeff();
        coeff = new Complex[] {
            p[0] * q[0] + p[1] * q[2],
            p[0] * q[1] + p[1] * q[3],
            p[2] * q[0] + p[3] * q[2],
            p[2] * q[1] + p[3] * q[3],
        };
    }

    public Complex[] getCoeff() {
        return (Complex[]) coeff.Clone();
    }

    public override string ToString() {
        return "[" + coeff[0] + ", " + coeff[1] + ", " + coeff[2] + ", " + coeff[3] + "]";
    }
}