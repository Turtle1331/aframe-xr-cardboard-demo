using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EuclidTree : MonoBehaviour
{

    public Transform pieceType;
    public int numberOfSides;
	public float angleScale;
	public float twistScale;
    public int maximumSteps;
	
	private Transform ptr;
	private float dist;

    // Start is called before the first frame update
    void Start()
    {
		dist = 1.098612f;
        ptr = new GameObject().transform;
        ptr.position = new Vector3(0, 0, 0);
		CoinObject co = createCoin(ptr.position);
		co.setTree(null, 1);
        int sides = numberOfSides;
        int steps = maximumSteps - 1;
        if (steps <= 0) return;
		
		createSubtree(sides, steps, co);
		
		int count = 0;

        for (int i = 0; i < sides - 1; i++) {
            ptr.Rotate(0, 360f / sides, 0);
			count += createSubtree(sides, steps, null);
        }
		
		Destroy(ptr.gameObject);
		transform.GetComponent<EuclideanPlane>().setTree(count);
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    private int createSubtree(int sides, int steps, CoinObject parent) {
		int count = 0;
		int sign = (steps % 2) * 2 - 1;
		
        ptr.Translate(new Vector3(sign * dist * (5f / 13), 0, dist * (12f / 13)));
		CoinObject co = createCoin(ptr.position);
		co.setTree(parent, 1);
		if (parent == null) {
			co = null;
			count++;
		}
        
        ptr.Translate(new Vector3(-sign * dist * (5f / 13), 0, dist * (12f / 13)));
		CoinObject co2 = createCoin(ptr.position);
		co2.setTree(co, sides - 1);
		if (co == null) {
			co2 = null;
			count++;
		}
        
        steps--;
        if (steps <= 0) {
			if (co2 != null) co2.activate();
			ptr.Translate(new Vector3(0, 0, -2 * dist * (12f / 13)));
			return count;
		}

        /*ptr.Rotate(0, 180f * angleScale, 0);
        for (int i = 0; i < sides - 1; i++) {
            ptr.Rotate(0, 360f / sides * angleScale, 0);
            count += createSubtree(sides, steps, co);
        }
		for (int i = 0; i < sides - 1; i++) {
            ptr.Rotate(0, -360f / sides * angleScale, 0);
        }
		ptr.Rotate(0, -180f * angleScale, 0);*/
        
		ptr.Rotate(0, -45, 0);
		count += createSubtree(sides, steps, co2);
		ptr.Rotate(0, 90, 0);
		count += createSubtree(sides, steps, co2);
		ptr.Rotate(0, -45, 0);
		
		ptr.Translate(new Vector3(0, 0, -2 * dist * (12f / 13)));
		return count;
    }
	
	private CoinObject createCoin(Vector3 position) {
		return ((Transform) Instantiate(pieceType, position, Quaternion.identity, transform)).GetComponent<CoinObject>();
	}
}
