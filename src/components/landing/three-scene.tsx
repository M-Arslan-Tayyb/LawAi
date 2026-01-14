"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useTheme } from "next-themes"

export function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    const primaryColor = resolvedTheme === "dark" ? 0xd4af37 : 0xc9a227
    const glowColor = resolvedTheme === "dark" ? 0xf4e4a6 : 0xd4af37

    // Create floating particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1500

    const posArray = new Float32Array(particlesCount * 3)
    const scaleArray = new Float32Array(particlesCount)

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 12
      posArray[i + 1] = (Math.random() - 0.5) * 12
      posArray[i + 2] = (Math.random() - 0.5) * 12
      scaleArray[i / 3] = Math.random()
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
    particlesGeometry.setAttribute("scale", new THREE.BufferAttribute(scaleArray, 1))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.025,
      color: primaryColor,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    const scaleGroup = new THREE.Group()

    // Main pillar (thicker)
    const pillarGeometry = new THREE.CylinderGeometry(0.04, 0.06, 2.2, 16)
    const pillarMaterial = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.8,
    })
    const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial)
    scaleGroup.add(pillar)

    // Base
    const baseGeometry = new THREE.CylinderGeometry(0.4, 0.5, 0.1, 32)
    const base = new THREE.Mesh(baseGeometry, pillarMaterial)
    base.position.y = -1.1
    scaleGroup.add(base)

    // Top ornament
    const topGeometry = new THREE.SphereGeometry(0.08, 16, 16)
    const top = new THREE.Mesh(topGeometry, pillarMaterial)
    top.position.y = 1.15
    scaleGroup.add(top)

    // Horizontal beam (thicker)
    const beamGeometry = new THREE.BoxGeometry(2.2, 0.06, 0.06)
    const beam = new THREE.Mesh(beamGeometry, pillarMaterial)
    beam.position.y = 0.95
    scaleGroup.add(beam)

    // Create pan function
    const createPan = (x: number) => {
      const panGroup = new THREE.Group()

      // Pan dish
      const panGeometry = new THREE.CylinderGeometry(0.25, 0.2, 0.08, 32)
      const pan = new THREE.Mesh(panGeometry, pillarMaterial)
      panGroup.add(pan)

      // Pan rim glow
      const rimGeometry = new THREE.TorusGeometry(0.23, 0.02, 8, 32)
      const rimMaterial = new THREE.MeshBasicMaterial({
        color: glowColor,
        transparent: true,
        opacity: 0.9,
      })
      const rim = new THREE.Mesh(rimGeometry, rimMaterial)
      rim.rotation.x = Math.PI / 2
      panGroup.add(rim)

      panGroup.position.set(x, 0.3, 0)
      return panGroup
    }

    const leftPan = createPan(-0.9)
    const rightPan = createPan(0.9)
    scaleGroup.add(leftPan)
    scaleGroup.add(rightPan)

    // Chains (more visible)
    const chainMaterial = new THREE.LineBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.9,
      linewidth: 2,
    })

    // Create chain segments
    const createChain = (startX: number, endY: number) => {
      const chainGroup = new THREE.Group()
      const segments = 8
      for (let i = 0; i < segments; i++) {
        const y1 = 0.95 - (i * (0.95 - endY)) / segments
        const y2 = 0.95 - ((i + 1) * (0.95 - endY)) / segments
        const points = [
          new THREE.Vector3(startX, y1, 0),
          new THREE.Vector3(startX + (i % 2 === 0 ? 0.02 : -0.02), (y1 + y2) / 2, 0),
          new THREE.Vector3(startX, y2, 0),
        ]
        const chainGeometry = new THREE.BufferGeometry().setFromPoints(points)
        const chain = new THREE.Line(chainGeometry, chainMaterial)
        chainGroup.add(chain)
      }
      return chainGroup
    }

    scaleGroup.add(createChain(-0.9, 0.35))
    scaleGroup.add(createChain(0.9, 0.35))

    scaleGroup.position.z = -3
    scaleGroup.position.y = 0.2
    scaleGroup.scale.setScalar(1.3)
    scene.add(scaleGroup)

    // Create connecting lines between particles
    const linesMaterial = new THREE.LineBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.15,
    })

    const linesGroup = new THREE.Group()
    for (let i = 0; i < 60; i++) {
      const points = []
      const startIdx = Math.floor(Math.random() * particlesCount) * 3
      const endIdx = Math.floor(Math.random() * particlesCount) * 3

      points.push(new THREE.Vector3(posArray[startIdx], posArray[startIdx + 1], posArray[startIdx + 2]))
      points.push(new THREE.Vector3(posArray[endIdx], posArray[endIdx + 1], posArray[endIdx + 2]))

      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(lineGeometry, linesMaterial)
      linesGroup.add(line)
    }
    scene.add(linesGroup)

    camera.position.z = 5

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Animation
    const clock = new THREE.Clock()

    const animate = () => {
      requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()

      // Rotate particles
      particlesMesh.rotation.y = elapsedTime * 0.04
      particlesMesh.rotation.x = elapsedTime * 0.02

      // Float the scales with gentle tilt
      scaleGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.25 + mouseX * 0.15
      scaleGroup.rotation.x = Math.cos(elapsedTime * 0.3) * 0.08 + mouseY * 0.08
      scaleGroup.position.y = 0.2 + Math.sin(elapsedTime * 0.5) * 0.08

      // Animate pans tilting
      leftPan.rotation.z = Math.sin(elapsedTime * 0.6) * 0.05
      rightPan.rotation.z = -Math.sin(elapsedTime * 0.6) * 0.05

      // Animate lines
      linesGroup.rotation.y = elapsedTime * 0.015
      linesGroup.rotation.x = elapsedTime * 0.008

      // Camera subtle movement based on mouse
      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.04
      camera.position.y += (mouseY * 0.4 - camera.position.y) * 0.04
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [resolvedTheme])

  return <div ref={containerRef} className="three-canvas" />
}
